const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const imageInitialize = require('../../helpers/imageInitialize');
const Users = require('../../../model/mongoose/users');
const Pages = require('../../../model/mongoose/pages');
const termsHelpers = require('../helpers');
const adminHelper = require('../../api/users/admins/adminHelpers');
const Companies = require('../../../model/mongoose/company');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /messages', function () {

    beforeEach(async function () {
        await imageInitialize.initialize();
    })

    afterEach(async function () {
        console.log('dropping database');
        this.timeout(1000);
        await mongo.drop();
    })

    describe('add terms & privacy of candidate', function () {

        it('it should add terms & privacy of candidate', async function () {
            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email});

            //terms page
            const info = docGenerator.cmsContentForTCCandidate();
            const cmsRes = await adminHelper.addTermsContent(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.page_name});

            //privacy page
            const privacyInfo = docGenerator.cmsContent();
            const cmsPrivacyRes = await adminHelper.addTermsContent(privacyInfo , companyDoc.jwt_token);
            const privacyDoc = await Pages.findOne({page_name: privacyInfo.page_name});

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email});
            const candTerms = docGeneratorV2.termsAndConditions();
            let inputQuery = {};
            inputQuery.terms_id = cmsDoc._id;
            inputQuery.privacy_id = privacyDoc._id;
            inputQuery.marketing_emails = candTerms.marketing_emails;
            const res = await termsHelpers.termsAndPrivacy(inputQuery,userDoc._id,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email});

            userDoc.marketing_emails.should.equal(candTerms.marketing_emails);

            const cmsID = userDoc.candidate.terms_id.toString();
            cmsID.should.equal(cmsDoc._id.toString());
            const privacyID = userDoc.candidate.privacy_id.toString();
            privacyID.should.equal(privacyDoc._id.toString());
        })
    });

    describe('company terms and conditions', function () {

        it('it should insert the TnC and marketing email', async function () {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email});

            //terms page
            const info = docGenerator.cmsContentFroTC();
            const cmsRes = await adminHelper.addTermsContent(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.page_name});

            //privacy page
            const privacyInfo = docGenerator.cmsContent();
            const cmsPrivacyRes = await adminHelper.addTermsContent(privacyInfo , companyDoc.jwt_token);
            const privacyDoc = await Pages.findOne({page_name: privacyInfo.page_name});

            const companyTnCWizard = docGeneratorV2.companyTnCWizard();
            let inputQuery = {};
            inputQuery.terms_id = cmsDoc._id;
            inputQuery.privacy_id = privacyDoc._id;
            inputQuery.marketing_emails = companyTnCWizard.marketing_emails;
            const SummaryTnC = await termsHelpers.termsAndPrivacy(inputQuery,companyDoc._id,companyDoc.jwt_token);

            const newCompanyDoc = await Companies.findOne({_creator: companyDoc._id});
            const cmsID = newCompanyDoc.terms_id.toString();
            cmsID.should.equal(cmsDoc._id.toString());
            const privacyID = newCompanyDoc.privacy_id.toString();
            privacyID.should.equal(privacyDoc._id.toString());
            newCompanyDoc.marketing_emails.should.equal(companyTnCWizard.marketing_emails);
        })
    });

    describe('user account setting' , () => {

        it('it should enable or disbale the account setting' , async() => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupCompany(company);

            let userDoc = await Users.findOne({email: company.email});
            userDoc.disable_account.should.equal(false);

            let inputQuery = {};
            inputQuery.disable_account = true;
            const accountSetting = await termsHelpers.termsAndPrivacy(inputQuery,userDoc._id,userDoc.jwt_token);

            userDoc = await Users.findOne({email: company.email});
            userDoc.disable_account.should.equal(true);
        })
    });
});