const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../../../../../../server/test/api/users/candidate/candidateHelpers');
const candidateHelpers = require('../candidateHelpers');
const userHelpers = require('../../../../../../server/test/api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get all users', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /v2/users/candidates/search?is_admin', () => {

        it('it should get all users', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );
            await userHelpers.makeAdmin(candidate.email);

            let userDoc = await Users.findOne({email: candidate.email});

            const isAdmin = true;
            const getAllCandidates = await candidateHelpers.getAll(isAdmin,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email});

            getAllCandidates.body[0].email.should.equal(userDoc.email);
            getAllCandidates.body[0].first_name.should.equal(userDoc.first_name);
            getAllCandidates.body[0].last_name.should.equal(userDoc.last_name);
        })
    })
});