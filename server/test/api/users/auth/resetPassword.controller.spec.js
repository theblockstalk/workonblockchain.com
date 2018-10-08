const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('reset password of candidate or company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/reset_password/:hash' , () =>
    {
        it('it should reset candidate password' , async () =>
        {
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);

            const forgotPassword = await authenticateHepler.forgotPassworsEmail(candidate.email);

            let userDoc = await Users.findOne({email: candidate.email}).lean();

            const resetPassword = await authenticateHepler.resetPassword(userDoc.forgot_password_key, candidate.password);

            userDoc = await Users.findOne({email: candidate.email}).lean();
            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(candidate.password);
            const hashedPasswordAndSalt = hash.digest('hex');

            userDoc.password_hash.should.equal(hashedPasswordAndSalt);

        })


    })

});