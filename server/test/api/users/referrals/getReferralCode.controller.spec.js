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

describe('get info of user who refereed a person', function () {

    afterEach(async () => {
        console.log('dropping database');
    })

    describe('POST /users/get_refrence_code', () => {

        it('it should get info of user who refereed a person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const referralInfo = await referralsHelper.getRefreeInfo(userDoc.ref_link);
            referralInfo.body._creator.ref_link.should.equal(userDoc.ref_link);
        })
    })
});