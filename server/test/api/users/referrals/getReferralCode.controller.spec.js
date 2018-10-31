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

describe('get info of user who refereed a person', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_refrence_code', () => {

        it('it should get info of user who refereed a person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const refDoc = await Refrreal.findOne({email: candidate.email}).lean();

            const referralInfo = await referralsHelper.getRefreeInfo(refDoc.url_token);
            const res = referralInfo.body;
            res.email.should.equal(refDoc.email);
        })
    })
});