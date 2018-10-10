const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHepler = require('../companyHelpers');
const candidateHepler = require('../../candidate/candidateHelpers');

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
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const candidateRes = await candidateHepler.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const companyReply =0 ;
            const filterRes = await companyHepler.getVerifiedCandidateDetail(candidateUserDoc._id , companyReply, companyUserDoc.jwt_token);

            filterRes.body._creator.is_verify.should.equal(1);
            filterRes.body._creator.is_approved.should.equal(1);
            filterRes.body._creator.disable_account.should.equal(false);
            filterRes.body._creator.type.should.equal("candidate");
            let name = candidate.first_name[0].toUpperCase() + candidate.last_name[0].toUpperCase();
            filterRes.body.initials.should.equal(name);

        })

        it('it should return verified candidate detail of first chat offer accepted', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const candidateRes = await candidateHepler.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const companyReply =1 ;
            const filterRes = await companyHepler.getVerifiedCandidateDetail(candidateUserDoc._id , companyReply, companyUserDoc.jwt_token);

            filterRes.body._creator.is_verify.should.equal(1);
            filterRes.body._creator.is_approved.should.equal(1);
            filterRes.body._creator.disable_account.should.equal(false);
            filterRes.body._creator.type.should.equal("candidate");
            filterRes.body.first_name.should.equal(candidate.first_name);
            filterRes.body.last_name.should.equal(candidate.last_name);

        })
    })
});