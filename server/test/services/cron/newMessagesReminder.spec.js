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
const companiesHelperV2 = require('../../api-v2/users/companies/companyHelpers')
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

            // send message to the candidate and check they are sent an email
            const jobOffer = docGeneratorV2.messages.approach(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            let startTime = new Date();
            await newMessagesEmail();
            candidateuserDoc = await users.findOneById(candidateuserDoc._id);
            expect(candidateuserDoc.last_message_reminder_email).to.be.within(startTime, new Date());

            // send message to the company and check they are sent an email
            const jobOfferAccepted = docGeneratorV2.messages.approach_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            startTime = new Date();
            await newMessagesEmail();
            const companyDoc = await users.findOneByEmail(company.email);
            expect(companyDoc.last_message_reminder_email).to.be.within(startTime, new Date());
        })

        it('should send only send one email if messages are sent after 20s', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            await users.update({email: company.email}, {$set: {is_admin: 1}});
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData);
            await users.update({email: candidate.email}, {$set: {is_admin: 1}});
            let candidateuserDoc = await users.findOneByEmail(candidate.email);

            // send message to compay and candidate and get the time that an email was sent to the company
            const jobOffer = docGeneratorV2.messages.approach(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.approach_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            await newMessagesEmail();
            let companyDoc = await users.findOneByEmail(company.email);
            const firstEmailDate = companyDoc.last_message_reminder_email;

            // send another message to the company and check that another email was not sent (because it was <20s)
            let normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email.getTime()).to.equal(firstEmailDate.getTime());

            // send two message to the company and check that another email was not sent (because it was <20s)
            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email.getTime()).to.equal(firstEmailDate.getTime());

            // send two message to the company and check that another email was not sent because one was sent in the previous hour
            let timeMinusInterval = new Date();
            timeMinusInterval.setSeconds(timeMinusInterval.getSeconds() - 30); //-20 Secs
            await users.update({_id: companyUserDoc._id}, {last_message_reminder_email: timeMinusInterval});
            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email.getTime()).to.equal(timeMinusInterval.getTime());

            // send two message to the company and check that another email was sent
            let timeMinus20s = new Date();
            timeMinus20s.setSeconds(timeMinus20s.getSeconds() - 3600 - 30); //-20 Secs
            await users.update({_id: companyUserDoc._id}, {last_message_reminder_email: timeMinus20s});
            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            normalMessage = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage, candidateuserDoc.jwt_token);

            let startTime = new Date();
            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email).to.be.within(startTime, new Date());
        })

        it('should send only send one email if messages are sent from two users', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            await users.update({email: company.email}, {$set: {is_admin: 1}});
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate1 = docGenerator.candidate();
            const profileData1 = docGeneratorV2.candidateProfile();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate1, profileData1);
            await users.update({email: candidate1.email}, {$set: {is_admin: 1}});
            let candidateuserDoc1 = await users.findOneByEmail(candidate1.email);

            // send message to compay and candidate and get the time that an email was sent to the company
            const jobOffer1 = docGeneratorV2.messages.approach(candidateuserDoc1._id);
            await messagesHelpers.post(jobOffer1, companyUserDoc.jwt_token);

            const jobOfferAccepted1 = docGeneratorV2.messages.approach_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted1, candidateuserDoc1.jwt_token);

            await newMessagesEmail();

            // do the same for another candidate
            const candidate2 = docGenerator.candidate();
            const profileData2 = docGeneratorV2.candidateProfile();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate2, profileData2);
            await users.update({email: candidate2.email}, {$set: {is_admin: 1}});
            let candidateuserDoc2 = await users.findOneByEmail(candidate2.email);

            // send message to compay and candidate and get the time that an email was sent to the company
            const jobOffer2 = docGeneratorV2.messages.approach(candidateuserDoc2._id);
            await messagesHelpers.post(jobOffer2, companyUserDoc.jwt_token);

            const jobOfferAccepted2 = docGeneratorV2.messages.approach_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted2, candidateuserDoc1.jwt_token);

            await newMessagesEmail();
            companyDoc = await users.findOneByEmail(company.email);
            const firstEmailDate = companyDoc.last_message_reminder_email;

            // send messages to the compan and check only one email is sent
            let normalMessage1 = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage1, candidateuserDoc1.jwt_token);

            let normalMessage2 = docGeneratorV2.messages.normal(companyUserDoc._id);
            await messagesHelpers.post(normalMessage2, candidateuserDoc2.jwt_token);

            await newMessagesEmail();
            companyDoc = await users.findOneById(companyUserDoc._id);
            expect(companyDoc.last_message_reminder_email.getTime()).to.equal(firstEmailDate.getTime());
        })
    })
});