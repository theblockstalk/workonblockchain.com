const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const Pages = require('../../../../model/mongoose/pages');
const companies = require('../../../../model/mongoose/companies');
const companyHepler = require('../companies/helpers');
const candidateHepler = require('../candidates/candidateHelpers');
const usersHelpers = require('../usersHelpers');
const docGeneratorV2 = require('../../../helpers/docGenerator-v2');
const pagesHelper = require('../../../../../server/test/api-v2/pages/pagesHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('account setting' , function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('Patch /users/account_settings' , () => {

        it('it should enable or disbale the account setting' , async() => {

        const company = docGeneratorV2.company();
        await companyHepler.signupVerifiedApprovedCompany(company);


        let userDoc = await Users.findOne({email: company.email});
        userDoc.disable_account.should.equal(false);
        let userId = userDoc._id;

        const accountSettingObject = docGeneratorV2.accountSetting();
        const accountSetting = await usersHelpers.accountSetting(userId, accountSettingObject, userDoc.jwt_token);

        userDoc = await Users.findOne({email: company.email});
        userDoc.is_unread_msgs_to_send.should.equal(false);
        userDoc.disable_account.should.equal(false);
        const newCompanyDoc = await companies.findOne({_creator: userDoc._id});
        newCompanyDoc.marketing_emails.should.equal(true);

    })

    it('it should update company terms id' , async() => {

        const company = docGeneratorV2.company();
        const companyRes = await companyHepler.signupAdminCompany(company);
        const companyDoc = await Users.findOne({email: company.email});

        const info = docGenerator.cmsContentFroTC();
        const cmsRes = await pagesHelper.addPages(info , companyDoc.jwt_token);
        const cmsDoc = await Pages.findOne({page_name: info.name});
        let userId = companyDoc._id;

        await usersHelpers.accountSetting(userId, {terms_id : cmsDoc._id} ,companyDoc.jwt_token);

        const newCompanyDoc = await companies.findOne({_creator: companyDoc._id});
        console.log(newCompanyDoc)
        const cmsID = newCompanyDoc.terms_id.toString();
        cmsID.should.equal(cmsDoc._id.toString());
    })

})
})