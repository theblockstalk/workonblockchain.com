const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const candidateProfile = require('../../../../../model/candidate_profile');
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

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candTerms = docGenerator.termsAndConditions();
            const res = await candidateHelper.candidateTerms(cmsDoc._id,candTerms,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.marketing_emails.should.equal(candTerms.marketing);
            const cmsID = newCandidateInfo.terms_id.toString();
            cmsID.should.equal(cmsDoc._id.toString());
        })
    })
});