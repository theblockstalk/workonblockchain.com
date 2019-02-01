const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const candidateHelper = require('../../candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verified candidates as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/verified_candidate', () => {

        it('it should return verified candidate', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            let userDoc = await Users.findOne({email: company.email}).lean();

            const filterRes = await companyHelper.verifiedCandidate(userDoc.jwt_token);

            filterRes.body[0].is_verify.should.equal(1);
            filterRes.body[0].candidate.status[0].status.should.equal('approved');
            filterRes.body[0].disable_account.should.equal(false);
            filterRes.body[0].type.should.equal("candidate");
        })
    })
});