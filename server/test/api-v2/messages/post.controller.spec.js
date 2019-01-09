const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const messagesHelpers = require('./helpers');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const users = require('../../../model/mongoose/users');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /messages', function () {

    afterEach(async function () {
        console.log('dropping database');
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
            res.body.message.should.equal("ValidationError: user_id: Path `user_id` is required.");
            res.status.should.equal(500);
        })

        it('it should should fail with invalid jwtToken', async function () {
            const res = await messagesHelpers.post({user_id: "my id", msg_tag: 'job_offer'}, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViOWQ0MGQ3MjVjZWM5MWY1YzgyNjM0ZiIsInR5cGUiOiJjYW5kaWRhdGUiLCJjcmVhdGVkX2RhdGUiOiIyMDE4LTA5LTE1VDE3OjI2OjQ3LjE4OFoiLCJpYXQiOjE1MzcwMzI0MzZ9.v1uv2zLsqhRPc0ADYqr1ZpY-MfP4sOqrwHsmk25GjN0');
            res.body.message.should.equal("Cannot read property 'jwt_token' of null");
            res.status.should.equal(500);
        })

    });

    describe('{ msg_tag:"job_offer" }', function () {

        it('it should send a message', async function () {

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
});