const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../../test/api-v2/otherHelpers/companyHelpers');
const candidateHelper = require('../../../test/api-v2/otherHelpers/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const Users = require('../../../model/mongoose/users');
const Pages = require('../../../model/mongoose/pages');
const termsHelpers = require('../helpers');
const Companies = require('../../../model/mongoose/companies');
const pageHelper = require('../../../test/api-v2/pages/pagesHelpers');
const usersHelpers = require('../../../test/api-v2/users/usersHelpers');
const helpers = require('../../../test/api-v2/helpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('POST /messages', function () {

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
            const cmsRes = await pageHelper.addPages(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.name});

            //privacy page
            const privacyInfo = docGenerator.cmsContent();
            const cmsPrivacyRes = await pageHelper.addPages(privacyInfo , companyDoc.jwt_token);
            const privacyDoc = await Pages.findOne({page_name: privacyInfo.name});

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email});
            const candTerms = docGeneratorV2.termsAndConditions();
            let termsQuery = {};
            termsQuery.terms_id = cmsDoc._id;
            const accountSetting = await usersHelpers.accountSetting(userDoc._id, termsQuery, userDoc.jwt_token);

            let privacyQuery = {};
            privacyQuery.privacy_id = privacyDoc._id;
            const res = await helpers.termsAndPrivacy(privacyQuery,userDoc._id,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email});

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
            const cmsRes = await pageHelper.addPages(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.name});

            //privacy page
            const privacyInfo = docGenerator.cmsContent();
            const cmsPrivacyRes = await pageHelper.addPages(privacyInfo , companyDoc.jwt_token);
            const privacyDoc = await Pages.findOne({page_name: privacyInfo.name});

            const companyTnCWizard = docGeneratorV2.companyTnCWizard();
            let termsQuery = {};
            termsQuery.terms_id = cmsDoc._id;
            const accountSetting = await usersHelpers.accountSetting(companyDoc._id, termsQuery, companyDoc.jwt_token);

            let privacyQuery = {};
            privacyQuery.privacy_id = privacyDoc._id;
            const SummaryTnC = await helpers.termsAndPrivacy(privacyQuery,companyDoc._id,companyDoc.jwt_token);

            const newCompanyDoc = await Companies.findOne({_creator: companyDoc._id});
            const cmsID = newCompanyDoc.terms_id.toString();
            cmsID.should.equal(cmsDoc._id.toString());
            const privacyID = newCompanyDoc.privacy_id.toString();
            privacyID.should.equal(privacyDoc._id.toString());
        })
    });
});