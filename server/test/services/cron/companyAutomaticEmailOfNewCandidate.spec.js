const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companies = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const companyEmail = require('../../../controller/services/cron/companyAutomaticEmailOfNewCandidate');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('cron', function () {

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
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const company = docGenerator.company();
            const companyTnCWizard = docGenerator.companyTnCWizard();
            const companyAbout = docGenerator.companyAbout();
            const searchPreferences = {
                saved_searches: [{
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
                    when_receive_email_notitfications: "Daily"
                }]
            };
            await companyHelper.signupCompanyAndCompleteProfile(company, companyTnCWizard, companyAbout, searchPreferences);

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            const companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

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
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const company = docGenerator.company();
            const companyTnCWizard = docGenerator.companyTnCWizard();
            const companyAbout = docGenerator.companyAbout();
            const searchPreferences = {
                saved_searches: [{
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
                    when_receive_email_notitfications: "Daily"
                }]
            };
            await companyHelper.signupCompanyAndCompleteProfile(company, companyTnCWizard, companyAbout, searchPreferences);

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            await companies.update({_creator: userCompanyDoc._id}, {$unset: {last_email_sent: 1}})
            let companyDoc = await companies.findOne({_creator: userCompanyDoc._id});

            let userCandidateDoc = await users.findOneByEmail(candidate.email);
           companyDoc.candidates_sent_by_email.length.should.equal(1);
           companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());

            await companyEmail();

            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            companyDoc.candidates_sent_by_email.length.should.equal(2);
           companyDoc.candidates_sent_by_email[0].user.toString().should.equal(userCandidateDoc._id.toString());
        })
    })
});