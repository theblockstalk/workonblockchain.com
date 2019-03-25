const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/mongoose/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const candidateHelper = require('../candidates/candidateHelpers');
const companyHepler = require('../companyHelpers');
const authenticateHepler = require('./authHelper');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('login as company or candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('post /users/auth', () => {
        it('it should login candidate' , async () =>
    {
        const candidate = docGenerator.candidate();
        const candidateRes = await candidateHelper.signupCandidate(candidate);
        candidateRes.should.have.status(200);

        const authenticateCandidate = await authenticateHepler.authenticateUser({email: candidate.email, password: candidate.password});
        should.exist(authenticateCandidate.body.jwt_token);

    })

    it('it should login company' , async () =>
    {
        const company = docGenerator.company();
    const companyRes = await companyHepler.signupCompany(company);
    companyRes.should.have.status(200);

    const authenticateCompany = await authenticateHepler.authenticateUser({email : company.email, password: company.password});
    should.exist(authenticateCompany.body.jwt_token);
})
})
});