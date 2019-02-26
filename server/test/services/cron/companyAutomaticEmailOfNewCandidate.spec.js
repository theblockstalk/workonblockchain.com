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


            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);
            const updatedData = await docGeneratorV2.companyUpdateProfile();
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

            await companyEmail();

            const userCompanyDoc = await users.findOneByEmail(company.email);
            companyDoc = await companies.findOne({_creator: userCompanyDoc._id});
            console.log("company doc");
            console.log(companyDoc);

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

            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            let companyDoc = await users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelper.verifyEmail(updateRes.body._creator.email);
            await userHelper.approve(updateRes.body._creator.email);

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
    })
});