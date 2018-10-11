const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const candidateProfileModel = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update candidate profile', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/update_profile', () => {

        it('it should update candidate profile', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candTerms = docGenerator.termsAndConditions();
            await candidateHelper.candidateTerms(candTerms,userDoc.jwt_token);

            const candidateProfile = docGenerator.profileData();
            await candidateHelper.about(candidateProfile,userDoc.jwt_token);

            const candidateJob = docGenerator.job();
            await candidateHelper.job(candidateJob,userDoc.jwt_token);

            const candidateResume = docGenerator.resume();
            await candidateHelper.resume(candidateResume,userDoc.jwt_token);

            const candidateExperience = docGenerator.experience();
            await candidateHelper.experience(candidateExperience,userDoc.jwt_token);

            const candidateNewProfileData = docGenerator.editCandidateProfile();
            const candidateNewEducationData = docGenerator.editEducation();
            const candidateNewWorkData = docGenerator.editWork();
            const res = await candidateHelper.editProfile(candidateNewProfileData,candidateNewEducationData,candidateNewWorkData,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfileModel.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.first_name.should.equal(candidateNewProfileData.first_name);
            newCandidateInfo.last_name.should.equal(candidateNewProfileData.last_name);
            newCandidateInfo.last_name.should.equal(candidateNewProfileData.last_name);
            newCandidateInfo.expected_salary.should.equal(candidateNewProfileData.expected_salary);
            newCandidateInfo.expected_salary_currency.should.equal(candidateNewProfileData.base_currency);
            newCandidateInfo.current_salary.should.equal(candidateNewProfileData.salary);
            newCandidateInfo.current_currency.should.equal(candidateNewProfileData.current_currency);
        })
    })
});