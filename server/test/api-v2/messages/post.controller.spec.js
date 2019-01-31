const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const messagesHelpers = require('../helpers');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const users = require('../../../model/mongoose/users');
const imageInitialize = require('../../helpers/imageInitialize');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /messages', function () {

    beforeEach(async function () {
        await imageInitialize.initialize();
    })

    afterEach(async function () {
        console.log('dropping database');
        this.timeout(1000);
        await mongo.drop();
    })

    describe('authorization and control', function () {

        it('it should should fail with wrong body schema', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const res = await messagesHelpers.post({not_a_field: "my id", msg_tag: 'job_offer'}, companyUserDoc.jwt_token);
            res.body.message.should.equal("ValidationError: receiver_id: Path `receiver_id` is required.");
            res.status.should.equal(500);
        })

        it('it should should fail with invalid jwtToken', async function () {
            const res = await messagesHelpers.post({receiver_id: "my id", msg_tag: 'job_offer'}, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViOWQ0MGQ3MjVjZWM5MWY1YzgyNjM0ZiIsInR5cGUiOiJjYW5kaWRhdGUiLCJjcmVhdGVkX2RhdGUiOiIyMDE4LTA5LTE1VDE3OjI2OjQ3LjE4OFoiLCJpYXQiOjE1MzcwMzI0MzZ9.v1uv2zLsqhRPc0ADYqr1ZpY-MfP4sOqrwHsmk25GjN0');
            res.body.message.should.equal("Cannot read property 'jwt_token' of null");
            res.status.should.equal(500);
        })

    });

    describe('{ msg_tag:"job_offer" }', function () {

        it('it should send job offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            const res = await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"job_offer_accepted" }', function () {

        it('it should accept job offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            const res = await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"job_offer_rejected" }', function () {

        it('it should reject job offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOfferRejected = docGeneratorV2.messages.job_offer_rejected(companyUserDoc._id);
            const res = await messagesHelpers.post(jobOfferRejected, candidateuserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"normal" }', function () {

        it('it should send a message', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            const normal = docGeneratorV2.messages.normal(companyUserDoc._id);
            const res = await messagesHelpers.post(normal, candidateuserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"interview_offer" }', function () {

        it('it should send interview offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            const interviewOffer = docGeneratorV2.messages.interview_offer(candidateuserDoc._id);
            const res = await messagesHelpers.post(interviewOffer, companyUserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"employment_offer" }', function () {

        it('it should send employment offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            const messageFileData = docGeneratorV2.messageFile();
            const employmentOffer = docGeneratorV2.messages.employment_offer(candidateuserDoc._id);
            const res = await messagesHelpers.sendFile(messageFileData,employmentOffer, companyUserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"employment_offer_accepted" }', function () {

        it('it should accept employment offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            const messageFileData = docGeneratorV2.messageFile();
            const employmentOffer = docGeneratorV2.messages.employment_offer(candidateuserDoc._id);
            const messageDoc = await messagesHelpers.sendFile(messageFileData,employmentOffer, companyUserDoc.jwt_token);

            let employmentOfferAccepted = docGeneratorV2.messages.employment_offer_accepted(companyUserDoc._id);
            employmentOfferAccepted.message.employment_offer_accepted.employment_offer_message_id = messageDoc.body._id;
            const res = await messagesHelpers.post(employmentOfferAccepted, candidateuserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"employment_offer_rejected" }', function () {

        it('it should reject employment offer', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(companyUserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, candidateuserDoc.jwt_token);

            const messageFileData = docGeneratorV2.messageFile();
            const employmentOffer = docGeneratorV2.messages.employment_offer(candidateuserDoc._id);
            const messageDoc = await messagesHelpers.sendFile(messageFileData,employmentOffer, companyUserDoc.jwt_token);

            const employmentOfferReject = docGeneratorV2.messages.employment_offer_rejected(companyUserDoc._id);
            employmentOfferReject.message.employment_offer_rejected.employment_offer_message_id = messageDoc.body._id;
            const res = await messagesHelpers.post(employmentOfferReject, candidateuserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });

    describe('{ msg_tag:"file" }', function () {

        it('it should send a file', async function () {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const jobOfferAccepted = docGeneratorV2.messages.job_offer_accepted(candidateuserDoc._id);
            await messagesHelpers.post(jobOfferAccepted, companyUserDoc.jwt_token);

            const messageFileData = docGeneratorV2.messageFile();
            const message = docGeneratorV2.messages.file(candidateuserDoc._id);
            const res = await messagesHelpers.sendFile(messageFileData,message, companyUserDoc.jwt_token);
            res.status.should.equal(200);
        })

    });
});