const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const candidateHelper = require('../../candidate/candidateHelpers');
const currency = require('../../../../../controller/services/currency')
const docGeneratorV2 = require('../../../../helpers/docGenerator-v2');
const userHelper = require('../../usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('search candidates as company', function () {

    afterEach(async function() {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/filter', function() {

        it('it should return the candidate with position and location ', async function () {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            console.log(candidateUserDoc.candidate);
            const locations = [{name : 'Remote' , visa_needed: false},
                {_id : '5c4aa17468cc293450c14c04' , visa_needed : true }];
            const params = {
                positions: candidateUserDoc.candidate.roles,
                locations: locations,
            }

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            filterRes.body[0]._id.should.equal(userDoc._id.toString());

        })

        it('it should return the candidate with currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const params = {
                current_currency: candidateUserDoc.candidate.expected_salary_currency,
                current_salary: candidateUserDoc.candidate.expected_salary*2
            };

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            filterRes.body[0]._id.should.equal(userDoc._id.toString());

        })

        it('it should not return the candidate with half currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const params = {
                current_currency: candidateUserDoc.candidate.expected_salary_currency,
                current_salary: candidateUserDoc.candidate.expected_salary*0.5
            }

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404)
        })

        it('it should return the candidate with half different-currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            let gbp = currency.convert(candidateUserDoc.candidate.expected_salary_currency, "£ GBP", candidateUserDoc.candidate.expected_salary);
            console.log(gbp);
            const params = {
                current_currency: "£ GBP",
                current_salary: gbp/1.11
            };

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(404)
        })

        it('it should not return the candidate with half different-currency search', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            console.log(candidateUserDoc.candidate.expected_salary_currency, candidateUserDoc.candidate.expected_salary);
            let gbp = currency.convert(candidateUserDoc.candidate.expected_salary_currency, "£ GBP", candidateUserDoc.candidate.expected_salary);
            console.log(gbp);
            const params = {
                current_currency: "£ GBP",
                current_salary: gbp/1.09
            };

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);
            filterRes.status.should.equal(200)
        })
    })
});