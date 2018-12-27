const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const candidateHelper = require('../../candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get verified candidate detail as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/candidate_detail', () => {

        it('it should return verified candidate detail of first chat offer unaccepted', async () => {

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const companyReply =0 ;
            const filterRes = await companyHelper.getVerifiedCandidateDetail(candidateUserDoc._id , companyReply, companyUserDoc.jwt_token);
            filterRes.body.is_verify.should.equal(1);
            filterRes.body.candidate.status[0].status.should.equal('approved');
            filterRes.body.disable_account.should.equal(false);
            filterRes.body.type.should.equal("candidate");
            let name = candidate.first_name[0].toUpperCase() + candidate.last_name[0].toUpperCase();
            filterRes.body.initials.should.equal(name);

        })

    })
});