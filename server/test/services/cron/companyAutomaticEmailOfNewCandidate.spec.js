const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companies = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const companyEmail = require('../../../controller/services/cron/companyAutomaticEmailOfNewCandidate');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const companiesHelperV2 = require('../../api-v2/users/companyHelpers')
const userHelper = require('../../api/users/usersHelpers');

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
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);
            const updatedData = await docGeneratorV2.companyUpdateProfile();
            updatedData.saved_searches = [{
                location: [
                    job.country[0]
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    job.roles[0]
                ],
                current_currency: job.base_currency,
                current_salary: job.expected_salary,
                skills: [
                    experience.language_exp[0].language
                ],
                availability_day: job.availability_day,
            }];

            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            const userCandidateDoc = await users.findOneByEmail(candidate.email);
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());
        })

        it('should not send a candidate if they have already been sent', async function () {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            updatedData.saved_searches = [{
                location: [
                    job.country[0]
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    job.roles[0]
                ],
                current_currency: job.base_currency,
                current_salary: job.expected_salary,
                skills: [
                    experience.language_exp[0].language
                ],
                availability_day: job.availability_day,
            }];

            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            await companies.update({_creator: userCompanyDoc._id}, {$unset: {last_email_sent: 1}})
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            let userCandidateDoc = await users.findOneByEmail(candidate.email);
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());

            await companyEmail();

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(1);
            companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());
        })

        it('should not only send to candidates after saved search update', async function () {

            let candidate = [], profileData= [], job = [], resume = [], experience = [];
            for (let i = 0; i < 5; i++) {
                candidate.push(docGenerator.candidate());
                profileData.push(docGenerator.profileData());
                job.push(docGenerator.job());
                resume.push(docGenerator.resume());
                experience.push(docGenerator.experience());
            }

            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            updatedData.saved_searches = [{
                location: [
                    job[0].country[0]
                ],
                job_type: [
                    "Part time"
                ],
                position: [
                    job[0].roles[0]
                ],
                current_currency: job[0].base_currency,
                current_salary: job[0].expected_salary,
                skills: [
                    experience[0].language_exp[0].language
                ],
                availability_day: job[0].availability_day
            }];

            const jwtToken = companyDoc.jwt_token;
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, jwtToken , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate[0], profileData[0], job[0], resume[0] ,experience[0]);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate[1], profileData[1], job[0], resume[1] ,experience[0]);

            await companyEmail();

            let userCompanyDoc = await users.findOneByEmail(company.email);
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(2);

            await candidateHelper.signupCandidateAndCompleteProfile(candidate[2], profileData[2], job[0], resume[2] ,experience[0]);

            await companyEmail();

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(3);

            let newSavedSearch = companyDoc.saved_searches;
            newSavedSearch[0].position = [
                job[1].roles[0]
            ];
            
            await candidateHelper.signupCandidateAndCompleteProfile(candidate[3], profileData[3], job[1], resume[3] ,experience[0]);

            await companiesHelperV2.companyProfileData(companyDoc._creator, jwtToken , {saved_searches : newSavedSearch});

            await candidateHelper.signupCandidateAndCompleteProfile(candidate[4], profileData[4], job[1], resume[4] ,experience[0]);

            await companyEmail();

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(4);

        })
    })
});