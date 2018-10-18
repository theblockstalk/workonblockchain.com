const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');
const Candidates = require('../../../../model/candidate_profile');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get all users', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/', () => {

        it('it should get all users', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            let candidateData = await Candidates.findOne({_creator: candidateUserDoc._id}).lean();

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const getAllCandidates = await candidateHelper.getAll(candidateUserDoc.jwt_token);
            getAllCandidates.body[0]._creator.email.should.equal(candidateUserDoc.email);
            getAllCandidates.body[0].first_name.should.equal(candidateData.first_name);
            getAllCandidates.body[0].last_name.should.equal(candidateData.last_name);
        })
    })
});