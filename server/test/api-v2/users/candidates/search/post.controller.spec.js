const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../../../otherHelpers/candidateHelpers');
const candidateHelpers = require('../candidateHelpers');
const userHelpers = require('../../../otherHelpers/usersHelpers');
const docGeneratorV2 = require('../../../../helpers/docGenerator-v2');
const messagesHelpers = require('../../../../../test/api-v2/helpers');
const companiesHelperV2 = require('../../companies/helpers');
const messages = require('../../../../../model/mongoose/messages');
const companyHelper = require('../../../otherHelpers/companyHelpers');
const currency = require('../../../../../controller/services/currency');
const candidateHelperV2 = require('../../../../api-v2/users/candidates/candidateHelpers');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /v2/users/candidates/search', function () {

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('admin search', function() {
        it('it should get all users for admin', async function() {
            const candidate = docGeneratorV2.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelperV2.candidateProfile(candidate, profileData);
            await userHelpers.makeAdmin(candidate.email);

            let  candidateUserDoc = await Users.findOne({email: candidate.email});
            const candidateEditProfileData = docGeneratorV2.candidateProfileUpdate();

            const res = await candidateHelperV2.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
            let userDoc = await Users.findOne({email: candidate.email});

            const isAdmin = true;
            const getAllCandidates = await candidateHelpers.getAll(isAdmin,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email});

            getAllCandidates.body[0].email.should.equal(userDoc.email);
            getAllCandidates.body[0].first_name.should.equal(userDoc.first_name);
            getAllCandidates.body[0].last_name.should.equal(userDoc.last_name);
        });

        it('it should search candidate by filter', async function() {
            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            const companyDoc = await Users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelpers.verifyEmail(company.email);
            await userHelpers.approve(company.email);

            await userHelpers.makeAdmin(company.email);
            const companyUserDoc = await Users.findOneByEmail(company.email);

            const candidate = docGeneratorV2.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelperV2.candidateProfile(candidate, profileData);
            await userHelpers.makeAdmin(candidate.email);

            let  candidateUserDoc = await Users.findOne({email: candidate.email});
            const candidateEditProfileData = docGeneratorV2.candidateProfileUpdate();

            await candidateHelperV2.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
            await userHelpers.approveCandidate(candidate.email);
            candidateUserDoc = await Users.findOne({email: candidate.email});

            const approachOffer = docGeneratorV2.messages.approach(candidateUserDoc._id);
            const res = await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

            const messageDoc = await messages.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id});
            console.log(messageDoc);
            const data = {
                msg_tags : [messageDoc.msg_tag],
                status : candidateUserDoc.candidate.history[0].status.status,
                word : candidate.first_name
            }
            const isAdmin = true;
            const candidateFilterRes = await candidateHelpers.candidateFilter(isAdmin,data , candidateUserDoc.jwt_token);
            candidateFilterRes.body[0].first_name.should.equal(candidate.first_name);
            candidateUserDoc.candidate.history[0].status.status.should.equal('approved');
            messageDoc.msg_tag.should.valueOf(data.msg_tags);
        })

        it('it should return verified candidate', async function() {
            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            let userDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.verifiedCandidate(userDoc.jwt_token);
            filterRes.body[0].is_verify.should.equal(1);
            filterRes.body[0].disable_account.should.equal(false);
            filterRes.body[0].type.should.equal("candidate");
        })
    });

    describe('company search', function() {
        it('it should return the candidate with position and location ', async function () {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});
            console.log(candidateUserDoc.candidate);
            const locations = [{name : 'Remote'},
                {city : '5c4aa17468cc293450c14c04' }];
            const params = {
                roles: candidateUserDoc.candidate.roles,
                locations: locations,
            };

            const comapnyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);

            let userDoc = await Users.findOne({email: candidate.email});
            filterRes.body[0]._id.should.equal(userDoc._id.toString());
        })

        it('it should return the candidate with currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});

            const params = {
                current_currency: candidateUserDoc.candidate.expected_salary_currency,
                current_salary: candidateUserDoc.candidate.expected_salary*2
            };

            const comapnyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);

            let userDoc = await Users.findOne({email: candidate.email});
            filterRes.body[0]._id.should.equal(userDoc._id.toString());

        })

        it('it should not return the candidate with half currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});

            const params = {
                current_currency: candidateUserDoc.candidate.employee.currency,
                current_salary: candidateUserDoc.candidate.employee.expected_annual_salary*0.5
            }

            const comapnyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404)
        })

        it('it should return the candidate with half different-currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});

            let gbp = currency.convert(candidateUserDoc.candidate.employee.currency, "£ GBP", candidateUserDoc.candidate.employee.expected_annual_salary);
            console.log(gbp);
            const params = {
                current_currency: "£ GBP",
                current_salary: gbp/1.11
            };

            const comapnyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404)
        })

        it('it should not return the candidate with half different-currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelpers.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});

            let gbp = currency.convert(candidateUserDoc.candidate.employee.currency, "£ GBP", candidateUserDoc.candidate.employee.expected_annual_salary);
            console.log(gbp);
            const params = {
                current_currency: "£ GBP",
                current_salary: gbp/1.09
            };

            const comapnyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200)
        })

        it('it should return the candidate with required skills', async function () {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileLanguageExprData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileLanguageExprData );
            await userHelpers.approveCandidate(candidate.email);

            const userDoc = await Users.findOne({email: candidate.email});
            let params = {
                required_skills: [{
                    name: userDoc.candidate.commercial_skills[0].name,
                    exp_year: userDoc.candidate.commercial_skills[0].exp_year - 1
                }]
            };

            const comapnyUserDoc = await Users.findOne({email: company.email});
            let filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);
            filterRes.body[0]._id.toString().should.equal(userDoc._id.toString());

            params = {
                required_skills: [{
                    name: userDoc.candidate.commercial_skills[0].name,
                    exp_year: userDoc.candidate.commercial_skills[0].exp_year + 1
                }]
            };
            filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404);

            params = {
                required_skills: [{
                    name: userDoc.candidate.commercial_skills[0].name
                }]
            };
            filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);
            filterRes.body[0]._id.toString().should.equal(userDoc._id.toString());

            params = {
                required_skills: [{
                    name: "not a skill name",
                    exp_year: 1
                }]
            };
            filterRes = await candidateHelpers.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404);
        })
    });
});