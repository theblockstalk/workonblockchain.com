const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/mongoose/users');
const docGenerator = require('../../helpers/docGenerator');
const referralsHelper = require('./referralHelpers');
const candidateHelper = require('../../../test/api/users/candidate/candidateHelpers');
const userHelper = require('../../../test/api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('create ref code for a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/referral?email', () => {

        it('it should create ref code for a user', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();

            const referralInfo = await referralsHelper.getRefCode(candidate.email);
            const res = referralInfo.body.referral;
            res.email.should.equal(candidate.email);
        })
    })

    describe('GET /v2/referral?email&admin', () => {

        it('it should return detail of referred user', async () => {
            //creating a candidate
            const candidate = docGenerator.candidate();
            const refDoc = await referralsHelper.getRefCode(candidate.email);

            const candidateReferred = {
                email: "sadia@mail.com",
                password: "Password1",
                type: "candidate",
                social_type : "",
                referred_email : refDoc.body.referral.email,
            }
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidateReferred, profileData,job,resume,experience );
            await userHelper.makeAdmin(candidateReferred.email);

            const candidateUserDoc = await Users.findOne({email: candidateReferred.email});

            const isAdmin = true;
            const referralDoc = await referralsHelper.getRefDetail(candidateUserDoc.referred_email, isAdmin,candidateUserDoc.jwt_token);
            referralDoc.body.referral.email.should.equal(candidate.email);
            referralDoc.body.referral.url_token.should.equal(refDoc.body.referral.url_token);

        })
    })

    describe('GET /v2/referral?ref_code', () => {

        it('it should get info of user who refereed a person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const referreInfo = await referralsHelper.getRefCode(candidate.email);

            const referralInfo = await referralsHelper.getRefreeInfo(referreInfo.body.referral.url_token);
            const res = referralInfo.body.email;
            res.should.equal(referreInfo.body.referral.email);
        })
    })
});