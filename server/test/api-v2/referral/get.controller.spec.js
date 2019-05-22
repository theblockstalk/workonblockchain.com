const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const referralsHelper = require('./referralHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('create ref code for a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/referral', () => {

        it('it should create ref code for a user', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();

            const referralInfo = await referralsHelper.getRefCode(candidate.email);
            const res = referralInfo.body;
            res.email.should.equal(candidate.email);
        })
    })
});