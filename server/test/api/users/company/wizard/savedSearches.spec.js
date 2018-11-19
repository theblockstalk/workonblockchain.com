const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const companyWizardHelper = require('./companyWizardHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('company saved searches', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/saved_searches', () => {

        it('it should insert the company saved preferences', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            const companyPrefernces = docGenerator.companySavedSearches();
            const companyWizardRes = await companyWizardHelper.companySavedSearchesWizard(companyPrefernces , companyRes.body.jwt_token);
            companyWizardRes.body.success.should.equal(true);
            const userDoc = await Users.findOne({email: company.email}).lean();
            companyPrefernces.saved_searches[0].location.should.equal(userDoc.company.saved_searches[0].location);
            companyPrefernces.saved_searches[0].job_type.should.equal(userDoc.company.saved_searches[0].job_type);
            companyPrefernces.saved_searches[0].current_currency.should.equal(userDoc.company.saved_searches[0].current_currency);
            companyPrefernces.saved_searches[0].current_salary.should.equal(userDoc.company.saved_searches[0].current_salary);
            companyPrefernces.saved_searches[0].skills.should.equal(userDoc.company.saved_searches[0].skills);
            companyPrefernces.saved_searches[0].receive_email_notitfications.should.equal(userDoc.company.saved_searches[0].receive_email_notitfications);
            companyPrefernces.saved_searches[0].when_receive_email_notitfications.should.equal(userDoc.company.saved_searches[0].when_receive_email_notitfications);
            companyPrefernces.saved_searches[0].position.should.valueOf(userDoc.company.saved_searches[0].position);
            companyPrefernces.saved_searches[0].blockchain.should.valueOf(userDoc.company.saved_searches[0].blockchain);
        })
    })
});