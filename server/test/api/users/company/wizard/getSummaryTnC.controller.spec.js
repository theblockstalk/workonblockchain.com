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

describe('company terms and conditions', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/company_wizard', () => {

        it('it should insert the TnC and marketing email', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const companyTnCWizard = docGenerator.companyTnCWizard();
            const SummaryTnC = await companyWizardHepler.SummaryTnC(companyTnCWizard ,companyRes.body.jwt_token);

            const userDoc = await Users.findOne({email: company.email}).lean();

            const companyDoc = await Companies.findOne({_creator: userDoc._id}).lean();
            should.exist(companyDoc);
            companyDoc.terms.should.equal(companyTnCWizard.terms);
            companyDoc.marketing_emails.should.equal(companyTnCWizard.marketing);

        })
    })
});