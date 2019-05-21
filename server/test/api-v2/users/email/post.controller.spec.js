const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const companyHepler = require('../../../../test/api/users/company/companyHelpers');
const docGenerator = require('../../../helpers/docGenerator');
const userHelpers = require('../usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verify client email', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /v2/users/email' , () =>
    {
        it('it should send verify email to candidate or company' , async () =>
        {
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const verifyClient = await userHelpers.verifyClient(companyRes.body.jwt_token,company.email);
            verifyClient.body.success.should.equal(true);
        })
    })
});