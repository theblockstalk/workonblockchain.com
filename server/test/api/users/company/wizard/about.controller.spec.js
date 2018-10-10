const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHepler = require('../companyHelpers');
const companyWizardHepler = require('./companyWizardHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('company about wizard', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/about_company', () => {

        it('it should insert the company about wizard data', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const companyAbout = docGenerator.companyAbout();
            const companyAboutWizard = await companyWizardHepler.companyAboutWizard(companyAbout , companyRes.body.jwt_token);

            const userDoc = await Users.findOne({email: company.email}).lean();

            const companyDoc = await Companies.findOne({_creator: userDoc._id}).lean();
            should.exist(companyDoc);
            companyDoc.company_founded.should.equal(companyAbout.company_founded);
            companyDoc.no_of_employees.should.equal(companyAbout.no_of_employees);
            companyDoc.company_funded.should.equal(companyAbout.company_funded);
            companyDoc.company_description.should.equal(companyAbout.company_description);


        })
    })
});