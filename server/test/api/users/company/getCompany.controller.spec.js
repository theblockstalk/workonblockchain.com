const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const companyHepler = require('./companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get all companies detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/company', () => {

        it('it should get all companies profile', async () => {
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const getAllCompanies = await companyHepler.getCompanies(candidateRes.body.jwt_token);
            getAllCompanies.body._creator.email.should.equal(company.email);
            getAllCompanies.body.first_name.should.equal(company.first_name);
            getAllCompanies.body.last_name.should.equal(company.last_name);
        })
    })
});