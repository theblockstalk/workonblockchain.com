const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('./companyHelpers');

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
            const companyRes = await companyHelper.signupAdminCompany(company);

            const userDoc = await Users.findOne({email: company.email}).lean();

            const getAllCompanies = await companyHelper.getCompanies(userDoc.jwt_token);

            getAllCompanies.body[0]._creator.email.should.equal(company.email);
            getAllCompanies.body[0].first_name.should.equal(company.first_name);
            getAllCompanies.body[0].last_name.should.equal(company.last_name);
        })
    })
});