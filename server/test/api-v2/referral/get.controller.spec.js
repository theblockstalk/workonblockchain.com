const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/mongoose/users');
const docGenerator = require('../../helpers/docGenerator');
const referralsHelper = require('./referralHelpers');
const candidateHelper = require('../../../test/api/users/candidate/candidateHelpers');
const userHelper = require('../../../test/api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('create ref code for a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/referral?ref_code', () => {

        it('it should get info of user who refereed a person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const referreInfo = await referralsHelper.getRefCode(candidate.email);

            const referralInfo = await referralsHelper.getRefreeInfo(referreInfo.body.referral.url_token);
            const res = referralInfo.body.email;
            res.should.equal(referreInfo.body.referral.email);
        })
    })
});