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
            const companyTnCWizard = docGenerator.companyTnCWizard();
            const companyAbout = docGenerator.companyAbout();
            await companyHelper.signupCompanyAndCompleteProfile(company,companyTnCWizard,companyAbout);
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const updatedData = await docGenerator.companyUpdateProfile();
            const updateRes = await companyHelper.UpdateCompanyProfile(updatedData , companyUserDoc.jwt_token);

            updateRes.body.success.should.equal(true);
            const companyDoc = await Companies.findOne({_creator: companyUserDoc._id}).lean();
            companyDoc.first_name.should.equal(updatedData.first_name);
            companyDoc.last_name.should.equal(updatedData.last_name);
            companyDoc.job_title.should.equal(updatedData.job_title);
            companyDoc.company_name.should.equal(updatedData.company_name);
            companyDoc.company_website.should.equal(updatedData.company_website);
            companyDoc.company_country.should.equal(updatedData.country);
            companyDoc.company_postcode.should.equal(updatedData.postal_code);
            companyDoc.company_city.should.equal(updatedData.city);
            companyDoc.company_founded.should.equal(updatedData.company_founded);
            companyDoc.no_of_employees.should.equal(updatedData.no_of_employees);
            companyDoc.company_funded.should.equal(updatedData.company_funded);
            companyDoc.company_description.should.equal(updatedData.company_description);

            companyDoc.saved_searches[0].location.should.valueOf(updatedData.saved_searches[0].location);
            companyDoc.saved_searches[0].job_type.should.equal(updatedData.saved_searches[0].job_type);
            companyDoc.saved_searches[0].current_currency.should.equal(updatedData.saved_searches[0].current_currency);
            companyDoc.saved_searches[0].current_salary.should.equal(updatedData.saved_searches[0].current_salary);
            companyDoc.saved_searches[0].skills.should.valueOf(updatedData.saved_searches[0].skills);
            companyDoc.saved_searches[0].receive_email_notitfications.should.equal(updatedData.saved_searches[0].receive_email_notitfications);
            companyDoc.saved_searches[0].when_receive_email_notitfications.should.equal(updatedData.saved_searches[0].when_receive_email_notitfications);
            companyDoc.saved_searches[0].position.should.valueOf(updatedData.saved_searches[0].position);
            companyDoc.saved_searches[0].blockchain.should.valueOf(updatedData.saved_searches[0].blockchain);

        })
    })
});