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

describe('verify client email', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/verify_client/:email' , () =>
    {
        it('it should send verify email to candidate or company' , async () =>
        {
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const verifyClient = await authenticateHepler.verifyClient(company.email);
            verifyClient.body.success.should.equal(true);

        })


    })

});