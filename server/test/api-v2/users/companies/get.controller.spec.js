const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('./companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get current company detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/users/companies', () => {

        it('it should get only current company profile detail', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            const userDoc = await Users.findOne({email: company.email});

            const getCurrentCompany = await companyHelper.getCurrentCompany(userDoc._id , userDoc.jwt_token);
            getCurrentCompany.body._creator.email.should.equal(company.email);
            getCurrentCompany.body.first_name.should.equal(company.first_name);
            getCurrentCompany.body.last_name.should.equal(company.last_name);

        })

        it('it should get all companies profile', async () => {
            const company = docGenerator.company();
            const companyRes = await companyHelper.signupAdminCompany(company);

            const userDoc = await Users.findOne({email: company.email});

            const isAdmin = false;
            const getAllCompanies = await companyHelper.getCompanies(isAdmin,userDoc.jwt_token);

            getAllCompanies.body[0]._creator.email.should.equal(company.email);
            getAllCompanies.body[0].first_name.should.equal(company.first_name);
            getAllCompanies.body[0].last_name.should.equal(company.last_name);
        })
    })
});