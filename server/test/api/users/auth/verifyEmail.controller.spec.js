const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verify email of candidate or company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/emailVerify/:email_hash' , () =>
    {
        it('it should verify candidate email' , async () =>
        {
            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const candidateRes = await candidateHepler.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );


            let candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            candidateUserDoc.is_verify.should.equal(1);

            const verifyCandidate = await authenticateHepler.verifyEmail(candidateUserDoc.verify_email_key);

            candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            candidateUserDoc.is_verify.should.equal(1);
        })


    })

});