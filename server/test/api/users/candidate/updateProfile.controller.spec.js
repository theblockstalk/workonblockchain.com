const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const candidateProfileModel = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');
const Candidates = require('../../../../model/candidate_profile');

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
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const candidateEditProfileData = docGenerator.editCandidateProfile();

            const res = await candidateHelper.editProfile(candidateEditProfileData,candidateUserDoc.jwt_token);

            res.body.first_name.should.equal(candidateEditProfileData.detail.first_name);
            res.body.last_name.should.equal(candidateEditProfileData.detail.last_name);
            res.body.github_account.should.equal(candidateEditProfileData.detail.github_account);
            res.body.stackexchange_account.should.equal(candidateEditProfileData.detail.exchange_account);
            res.body.contact_number.should.equal(candidateEditProfileData.detail.contact_number);
            res.body.nationality.should.equal(candidateEditProfileData.detail.nationality);
            res.body.locations.should.valueOf(candidateEditProfileData.detail.country);
            res.body.roles.should.valueOf(candidateEditProfileData.detail.roles);
            res.body.interest_area.should.valueOf(candidateEditProfileData.detail.interest_area);
            res.body.expected_salary_currency.should.equal(candidateEditProfileData.detail.base_currency);
            res.body.expected_salary.should.equal(candidateEditProfileData.detail.expected_salary);
            res.body.availability_day.should.equal(candidateEditProfileData.detail.availability_day);
            res.body.why_work.should.equal(candidateEditProfileData.detail.why_work);
            res.body.experimented_platform.should.valueOf(candidateEditProfileData.detail.experimented_platform);
            res.body.platforms.should.valueOf(candidateEditProfileData.detail.platforms);
            res.body.current_salary.should.equal(candidateEditProfileData.detail.salary);
            res.body.current_currency.should.equal(candidateEditProfileData.detail.current_currency);
            res.body.programming_languages.should.valueOf(candidateEditProfileData.detail.language_experience_year);
            res.body.education_history.should.valueOf(candidateEditProfileData.education);
            res.body.work_history.should.valueOf(candidateEditProfileData.work);
            res.body.description.should.equal(candidateEditProfileData.detail.intro);

        })
    })
});