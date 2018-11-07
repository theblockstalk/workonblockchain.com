const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const candidateProfile = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');

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

            let  candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            const candidateEditProfileData = docGenerator.editCandidateProfile();

            const res = await candidateHelper.editProfile(candidateEditProfileData,candidateUserDoc.jwt_token);
            res.body.success.should.equal(true);

            const candidateInfo = await candidateProfile.findOne({_creator: candidateUserDoc._id}).lean();

            candidateInfo.first_name.should.equal(candidateEditProfileData.detail.first_name);
            candidateInfo.last_name.should.equal(candidateEditProfileData.detail.last_name);
            candidateInfo.github_account.should.equal(candidateEditProfileData.detail.github_account);
            candidateInfo.stackexchange_account.should.equal(candidateEditProfileData.detail.exchange_account);
            candidateInfo.contact_number.should.equal(candidateEditProfileData.detail.contact_number);
            candidateInfo.nationality.should.equal(candidateEditProfileData.detail.nationality);
            candidateInfo.locations.should.valueOf(candidateEditProfileData.detail.country);
            candidateInfo.roles.should.valueOf(candidateEditProfileData.detail.roles);
            candidateInfo.interest_area.should.valueOf(candidateEditProfileData.detail.interest_area);
            candidateInfo.expected_salary_currency.should.equal(candidateEditProfileData.detail.base_currency);
            candidateInfo.expected_salary.should.equal(candidateEditProfileData.detail.expected_salary);
            candidateInfo.availability_day.should.equal(candidateEditProfileData.detail.availability_day);
            candidateInfo.why_work.should.equal(candidateEditProfileData.detail.why_work);
            candidateInfo.experimented_platform.should.valueOf(candidateEditProfileData.detail.experimented_platform);
            candidateInfo.platforms.should.valueOf(candidateEditProfileData.detail.platforms);
            candidateInfo.current_salary.should.equal(candidateEditProfileData.detail.salary);
            candidateInfo.current_currency.should.equal(candidateEditProfileData.detail.current_currency);
            candidateInfo.programming_languages.should.valueOf(candidateEditProfileData.detail.language_experience_year);
            candidateInfo.education_history.should.valueOf(candidateEditProfileData.education);
            candidateInfo.work_history.should.valueOf(candidateEditProfileData.work);
            candidateInfo.description.should.equal(candidateEditProfileData.detail.intro);

            candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const blockchainSkills = candidateUserDoc.candidate.blockchain;

            candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.detail.city);
            candidateUserDoc.candidate.base_country.should.equal(candidateEditProfileData.detail.base_country);
            blockchainSkills.commercial_skills[0].skill.should.equal(candidateEditProfileData.detail.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.detail.commercial_skills[0].exp_year);
            blockchainSkills.formal_skills[0].skill.should.equal(candidateEditProfileData.detail.formal_skills[0].skill);
            blockchainSkills.formal_skills[0].exp_year.should.equal(candidateEditProfileData.detail.formal_skills[0].exp_year);


        })
    })
});