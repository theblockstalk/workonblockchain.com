const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const Pages = require('../../../../../model/pages_content');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const companyWizardHelper = require('./companyWizardHelpers');
const adminHelper = require('../../admins/adminHelpers');

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
            const companyRes = await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            const info = docGenerator.cmsContentFroTC();
            const cmsRes = await adminHelper.addTermsContent(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.page_name}).lean();

            const companyTnCWizard = docGenerator.companyTnCWizard();
            const SummaryTnC = await companyWizardHelper.SummaryTnC(cmsDoc._id,companyTnCWizard ,companyDoc.jwt_token);

            const newCompanyDoc = await Companies.findOne({_creator: companyDoc._id}).lean();
            const cmsID = newCompanyDoc.terms_id.toString();
            cmsID.should.equal(cmsDoc._id.toString());
            newCompanyDoc.marketing_emails.should.equal(companyTnCWizard.marketing);

        })
    })
});