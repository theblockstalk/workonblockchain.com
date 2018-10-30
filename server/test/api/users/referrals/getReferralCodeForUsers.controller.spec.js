const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Refrreal = require('../../../../model/referrals');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('../candidate/candidateHelpers');
const referralsHelper = require('./referralsHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('create ref code for a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_ref_code', () => {

        it('it should create ref code for a user', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();

            const referralInfo = await referralsHelper.getRefCode(candidate.email);
            const res = referralInfo.body;
            res.email.should.equal(candidate.email);
        })
    })
});