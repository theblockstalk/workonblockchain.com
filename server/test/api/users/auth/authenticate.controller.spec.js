const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const Companies = require('../../../../model/employer_profile');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');


const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('login as company or candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/authenticate' , () =>
    {
        it('it should login candidate' , async () =>
        {
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);

            const authenticateCandidate = await authenticateHepler.authenticateUser(candidate.email, candidate.password);
            should.exist(authenticateCandidate.body.jwt_token);

        })

        it('it should login company' , async () =>
        {
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);
            companyRes.should.have.status(200);

            const authenticateCompany = await authenticateHepler.authenticateUser(company.email, company.password);
            should.exist(authenticateCompany.body.jwt_token);
        })
    })

});