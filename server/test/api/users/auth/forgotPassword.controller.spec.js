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

describe('forgot password email of candidate or company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/forgot_password/:email' ,() =>
    {
        it('it should sent forgot password email to candidate', async () =>
        {
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);

            const forgotPasswordEmail = await authenticateHepler.forgotPassworsEmail(candidate.email);
            forgotPasswordEmail.body.success.should.equal(true);

        })
    })

});