const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Pages = require('../../../../../model/pages_content');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../candidateHelpers');
const adminHelper = require('../../admins/adminHelpers');
const companyHelper = require('../../../users/company/companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('add terms of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/terms', () => {

        it('it should add terms of candidate', async () => {
            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            const info = docGenerator.cmsContentForTCCandidate();
            const cmsRes = await adminHelper.addTermsContent(info , companyDoc.jwt_token);
            const cmsDoc = await Pages.findOne({page_name: info.page_name}).lean();
            console.log(cmsDoc);
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const candTerms = docGenerator.termsAndConditions();
            const res = await candidateHelper.candidateTerms(cmsDoc._id,candTerms,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email}).lean();
            userDoc.marketing_emails.should.equal(candTerms.marketing);
            console.log(userDoc);
            const cmsID = userDoc.candidate.terms_id.toString();
            console.log(cmsID);
            cmsID.should.equal(cmsDoc._id.toString());
        })
    })
});