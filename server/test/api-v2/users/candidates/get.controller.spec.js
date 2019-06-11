const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const companyHelper = require('../../otherHelpers/companyHelpers');
const candidateHelper = require('../../otherHelpers/candidateHelpers');
const docGeneratorV2 = require('../../../../test/helpers/docGenerator-v2');
const userHelper = require('../../otherHelpers/usersHelpers');
const candidateHelpers = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get verified candidate detail as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/users/candidates', () => {

        it('it should return verified candidate detail of first chat offer unaccepted', async () => {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});
            console.log(candidateUserDoc.candidate.history);
            const companyUserDoc = await Users.findOne({email: company.email});
            const filterRes = await candidateHelpers.getVerifiedCandidateDetail(candidateUserDoc._id, companyUserDoc.jwt_token);
            filterRes.body.is_verify.should.equal(1);
            filterRes.body.disable_account.should.equal(false);
            filterRes.body.type.should.equal("candidate");
        })
    })
});