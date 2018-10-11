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

describe('update profile as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/update_company_profile', () => {

        it('it should update company profile', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            const updatedData = await docGenerator.companyUpdateProfile();
            const updateRes = await companyHelper.UpdateCompanyProfile(updatedData , companyRes.body.jwt_token);

            updateRes.body.first_name.should.equal(updatedData.first_name);
            updateRes.body.last_name.should.equal(updatedData.last_name);
            updateRes.body.job_title.should.equal(updatedData.job_title);
            updateRes.body.company_name.should.equal(updatedData.company_name);
            updateRes.body.company_website.should.equal(updatedData.company_website);
            updateRes.body.company_country.should.equal(updatedData.country);
            updateRes.body.company_postcode.should.equal(updatedData.postal_code);
            updateRes.body.company_city.should.equal(updatedData.city);
            updateRes.body.company_founded.should.equal(updatedData.company_founded);
            updateRes.body.no_of_employees.should.equal(updatedData.no_of_employees);
            updateRes.body.company_funded.should.equal(updatedData.company_funded);
            updateRes.body.company_description.should.equal(updatedData.company_description);

        })
    })
});