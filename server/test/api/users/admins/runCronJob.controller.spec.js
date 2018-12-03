const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');
const userHelper = require('../../users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin run cron job metrics', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/run_cron/:cron_name', function() {

        it('it should run the cron job', async function() {

            const candidate = docGenerator.candidate();

            await candidateHelper.signupCandidate(candidate);
            await userHelper.makeAdmin(candidate.email);
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const cronRes = await adminHelper.runCron("syncSendgrid", candidateUserDoc.jwt_token);
            cronRes.should.have.status(500);
        })

        it('it should fail run the cron job with wrong name', async function() {

            const candidate = docGenerator.candidate();

            await candidateHelper.signupCandidate(candidate);
            await userHelper.makeAdmin(candidate.email);
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const cronRes = await adminHelper.runCron("wrongParam", candidateUserDoc.jwt_token);
            cronRes.should.have.status(400);
        })

        it('it should fail for non-admin', async function() {

            const candidate = docGenerator.candidate();

            await candidateHelper.signupCandidate(candidate);
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const cronRes = await adminHelper.runCron("syncSendgrid", candidateUserDoc.jwt_token);
            cronRes.should.have.status(403);
        })
    })
});