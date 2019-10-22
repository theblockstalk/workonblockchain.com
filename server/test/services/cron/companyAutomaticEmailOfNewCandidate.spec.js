const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companies = require('../../../model/mongoose/companies');
const users = require('../../../model/mongoose/users');

const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api-v2/otherHelpers/companyHelpers');
const candidateHelper = require('../../api-v2/otherHelpers/candidateHelpers');
const companyEmail = require('../../../controller/services/cron/companyAutomaticEmailOfNewCandidate');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const companiesHelperV2 = require('../../api-v2/users/companies/helpers')
const userHelper = require('../../api-v2/otherHelpers/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('cron', function () {
    this.timeout(5000);

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('send candidates to companies', function () {

        it('should send one candidate', async function () {

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();
            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            updatedData.saved_searches = [{
                name: 'update search name',
                location: [
                    {remote: true}
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    profileData.candidate.employee.roles[0]
                ],
                current_currency: profileData.candidate.employee.currency,
                current_salary: profileData.candidate.employee.expected_annual_salary,
                required_skills: [
                    profileData.candidate.commercial_skills[0]
                ]
            }];

            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._id, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData);
            await userHelper.approveCandidate(candidate.email);
            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            const userCandidateDoc = await users.findOneByEmail(candidate.email);
            console.log(userCandidateDoc);
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());
        })

        it('should not send a candidate if they have already been sent', async function () {

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();
            console.log(profileData);

            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);
            console.log(companyDoc);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            console.log(updatedData);
            updatedData.saved_searches = [{
                name: 'update search name',
                location: [
                    {remote: true}
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    profileData.candidate.employee.roles[0]
                ],
                current_currency: profileData.candidate.employee.currency,
                current_salary: profileData.candidate.employee.expected_annual_salary,
                required_skills: [
                    profileData.candidate.commercial_skills[0]
                ]
            }];

            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._id, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData);

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            console.log(userCompanyDoc);
            await companies.update({_creator: userCompanyDoc._id}, {$unset: {last_email_sent: 1}})
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            let userCandidateDoc = await users.findOneByEmail(candidate.email);
            console.log(userCandidateDoc);
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());

            await companyEmail();

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());
        })

        it('should only sent new approved candidates that are approved after the saved search is updated', async function () {

            let candidate = [], profileData= [];
            for (let i = 0; i < 5; i++) {
                candidate.push(docGenerator.candidate());
                profileData.push(docGeneratorV2.candidateProfile());
            }

            const company = docGeneratorV2.company();

            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);


            const updatedData = await docGeneratorV2.companyUpdateProfile();

            updatedData.saved_searches = [{
                name: 'update search name',
                location: [
                    {remote: true}
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    profileData[0].candidate.employee.roles[0]
                ],
                current_currency: profileData[0].candidate.employee.currency,
                current_salary: profileData[0].candidate.employee.expected_annual_salary,
                required_skills: [
                    profileData[0].candidate.commercial_skills[0]
                ]
            }];

            const jwtToken = companyDoc.jwt_token;
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._id, jwtToken , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);
            // signup and approve candidate that matches the current company saved search
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[0], profileData[0]);
            // signup and approve second candidate that matches the current company saved search
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[1], profileData[0]);

            await companyEmail();
            //check that candidate 1 and 2 are sent to the company
            let userCompanyDoc = await users.findOneByEmail(company.email);

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(2);
            // signup and approve third candidate that matches the current company saved search
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[2], profileData[0]);

            await companyEmail();
            //check that candidate 3 are also sent to the company
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(3);

            let newSavedSearch = [{
                name: 'update search name again',
                location: [
                    {remote: true}
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    profileData[1].candidate.employee.roles[0]
                ],
                current_currency: profileData[1].candidate.employee.currency,
                current_salary: profileData[1].candidate.employee.expected_annual_salary,
                required_skills: [
                    profileData[0].candidate.commercial_skills[0]
                ]
            }];

            // signup and approve fourth candidate that is not matched the current company saved search
            // but will match the new company saved search
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[3], profileData[1]);
            // update the company saved search same preferences as candidate four
            // (but should not match because saved search update after candidate approve)
            await companiesHelperV2.companyProfileData(companyDoc._creator, jwtToken , {saved_searches : newSavedSearch});

            // signup and approve fifth candidate that should matched the new company saved search
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[4], profileData[1]);
            await companyEmail();
            //check that candidate 5 are also sent to the company but not candidate 4
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            companyDoc.candidates_sent_by_email.length.should.equal(5);

        })
    })
});

function fullLog(obj) {
    console.log(JSON.stringify(obj, null, 2));

}