const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
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

            candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const blockchainSkills = candidateUserDoc.candidate.blockchain;
            candidateUserDoc.first_name.should.equal(candidateEditProfileData.detail.first_name);
            candidateUserDoc.last_name.should.equal(candidateEditProfileData.detail.last_name);
            candidateUserDoc.candidate.github_account.should.equal(candidateEditProfileData.detail.github_account);
            candidateUserDoc.candidate.stackexchange_account.should.equal(candidateEditProfileData.detail.exchange_account);
            candidateUserDoc.candidate.linkedin_account.should.equal(candidateEditProfileData.detail.linkedin_account);
            candidateUserDoc.candidate.medium_account.should.equal(candidateEditProfileData.detail.medium_account);
            candidateUserDoc.contact_number.should.equal(candidateEditProfileData.detail.contact_number);
            candidateUserDoc.nationality.should.equal(candidateEditProfileData.detail.nationality);
            candidateUserDoc.candidate.locations.should.valueOf(candidateEditProfileData.detail.country);
            candidateUserDoc.candidate.roles.should.valueOf(candidateEditProfileData.detail.roles);
            candidateUserDoc.candidate.interest_areas.should.valueOf(candidateEditProfileData.detail.interest_areas);
            candidateUserDoc.candidate.expected_salary_currency.should.equal(candidateEditProfileData.detail.base_currency);
            candidateUserDoc.candidate.expected_salary.should.equal(candidateEditProfileData.detail.expected_salary);
            candidateUserDoc.candidate.availability_day.should.equal(candidateEditProfileData.detail.availability_day);
            candidateUserDoc.candidate.why_work.should.equal(candidateEditProfileData.detail.why_work);
            candidateUserDoc.candidate.blockchain.experimented_platforms.should.valueOf(candidateEditProfileData.detail.experimented_platforms);
            candidateUserDoc.candidate.blockchain.smart_contract_platforms.should.valueOf(candidateEditProfileData.detail.smart_contract_platforms);
            candidateUserDoc.candidate.current_salary.should.equal(candidateEditProfileData.detail.salary);
            candidateUserDoc.candidate.current_currency.should.equal(candidateEditProfileData.detail.current_currency);
            candidateUserDoc.candidate.programming_languages.should.valueOf(candidateEditProfileData.detail.language_experience_year);
            candidateUserDoc.candidate.education_history.should.valueOf(candidateEditProfileData.education);
            candidateUserDoc.candidate.work_history.should.valueOf(candidateEditProfileData.work);
            candidateUserDoc.candidate.description.should.equal(candidateEditProfileData.detail.intro);
            candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.detail.city);
            candidateUserDoc.candidate.base_country.should.equal(candidateEditProfileData.detail.base_country);
            blockchainSkills.commercial_skills[0].skill.should.equal(candidateEditProfileData.detail.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.detail.commercial_skills[0].exp_year);
            blockchainSkills.formal_skills[0].skill.should.equal(candidateEditProfileData.detail.formal_skills[0].skill);
            blockchainSkills.formal_skills[0].exp_year.should.equal(candidateEditProfileData.detail.formal_skills[0].exp_year);


        })
    })
});