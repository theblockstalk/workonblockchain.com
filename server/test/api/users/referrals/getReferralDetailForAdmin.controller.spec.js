const chai = require('chai');
const chaiHttp = require('chai-http');
const date = require('date-and-time');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const userHelper = require('../../users/usersHelpers');
const referralsHelper = require('./referralsHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('return referred user detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_refrence_detail', () => {

        it('it should return detail of referred user', async () => {
            //creating a candidate
            const candidate = docGenerator.candidate();
            const refDoc = await referralsHelper.getRefCode(candidate.email);

            const candidateReferred = {
                email: "sadia@mail.com",
                password: "Password1",
                type: "candidate",
                social_type : "",
                referred_email : refDoc.body.email,
            }
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidateReferred, profileData,job,resume,experience );
            await userHelper.makeAdmin(candidateReferred.email);

            const candidateUserDoc = await Users.findOne({email: candidateReferred.email}).lean();

            const referralDoc = await referralsHelper.getRefDetail({email : candidateUserDoc.referred_email}, candidateUserDoc.jwt_token);
            referralDoc.body.refDoc.email.should.equal(candidate.email);
            referralDoc.body.refDoc.url_token.should.equal(refDoc.body.url_token);

        })
    })
});