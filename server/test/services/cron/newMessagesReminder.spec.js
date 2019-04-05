const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companies = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const newMessagesEmail = require('../../../controller/services/cron/newMessagesReminderEmail');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const companiesHelperV2 = require('../../api-v2/users/companyHelpers')
const userHelper = require('../../api/users/usersHelpers');
const messagesHelpers = require('../../api-v2/helpers');

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

    describe('send email to user on new message', function () {

        it('should send email to the user right after they have been sent', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            await users.update({email: company.email}, {$set: {is_admin: 1}});
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData);
            await users.update({email: candidate.email}, {$set: {is_admin: 1}});
            let candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            let startTime = new Date();
            await newMessagesEmail();
            candidateuserDoc = await users.findOneById(candidateuserDoc._id);
            expect(candidateuserDoc.last_message_reminder_email).to.be.within(startTime, new Date());

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            startTime = new Date();
            await newMessagesEmail();
            const companyDoc = await users.findOneByEmail(company.email);
            expect(companyDoc.last_message_reminder_email).to.be.within(startTime, new Date());
        })

        it('should send only send one email if two messages are sent', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            await users.update({email: company.email}, {$set: {is_admin: 1}});
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData);
            await users.update({email: candidate.email}, {$set: {is_admin: 1}});
            let candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);


            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            await newMessagesEmail();
            let companyDoc = await users.findOneByEmail(company.email);
            const firstEmailDate = companyDoc.last_message_reminder_email;

            let normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            // no new email sent within 20s
            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email).to.be.within(firstEmailDate,new Date());
        })
    })
});