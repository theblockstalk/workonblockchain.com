const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('../candidate/candidateHelpers');
const referralsHelper = require('./referralsHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('send referral email to a person', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/send_refreal', () => {

        it('it should send referral email to a person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const email = 'tayyab4793@gmail.com';
            const subject = 'Come join WOB';
            const body = 'This email is for test case';
            await referralsHelper.sendReferralEmail(email,subject,body,userDoc.jwt_token);
        })
    })
});