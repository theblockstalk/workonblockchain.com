const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const candidateHelper = require('../../candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verified candidates as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/verified_candidate', () => {

        it('it should return verified candidate', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: company.email}).lean();

            const filterRes = await companyHelper.verifiedCandidate(userDoc.jwt_token);

            let id = filterRes.body[0].ids[0];
            userDoc = await Users.findOne({_id: id}).lean();
            userDoc.is_verify.should.equal(1);
            userDoc.is_approved.should.equal(1);
            userDoc.disable_account.should.equal(false);
            userDoc.type.should.equal("candidate");

        })
    })
});