const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator-v2');
const candidateHelper = require('./candidateHelpers');
const userHelper = require('../../otherHelpers/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update candidate profile', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('Patch /users/user_id/candidates', () => {

        it('it should update candidate profile', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.candidateProfile();

            await candidateHelper.candidateProfile(candidate, profileData);

            let  candidateUserDoc = await users.findOne({email: candidate.email}).lean();
            const candidateEditProfileData = docGenerator.candidateProfileUpdate();

            const res = await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
            candidateUserDoc = await users.findOne({email: candidate.email}).lean();
            const blockchainSkills = candidateUserDoc.candidate.blockchain;

            candidateUserDoc.candidate.github_account.should.equal(candidateEditProfileData.github_account);
            candidateUserDoc.candidate.stackexchange_account.should.equal(candidateEditProfileData.exchange_account);
            candidateUserDoc.contact_number.should.equal(candidateEditProfileData.contact_number);
            candidateUserDoc.candidate.employee.location.should.valueOf(candidateEditProfileData.employee.location);
            candidateUserDoc.candidate.employee.roles.should.valueOf(candidateEditProfileData.employee.roles);
            candidateUserDoc.candidate.interest_areas.should.valueOf(candidateEditProfileData.interest_areas);
            blockchainSkills.experimented_platforms.should.valueOf(candidateEditProfileData.experimented_platforms);
            candidateUserDoc.candidate.programming_languages.should.valueOf(candidateEditProfileData.programming_languages);
            candidateUserDoc.candidate.education_history.should.valueOf(candidateEditProfileData.education_history);
            candidateUserDoc.candidate.work_history.should.valueOf(candidateEditProfileData.work_history);
            candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.base_city);
            blockchainSkills.commercial_skills[0].skill.should.equal(candidateEditProfileData.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.commercial_skills[0].exp_year);
            blockchainSkills.commercial_platforms[0].name.should.equal(candidateEditProfileData.commercial_platforms[0].name);
            blockchainSkills.commercial_platforms[0].exp_year.should.equal(candidateEditProfileData.commercial_platforms[0].exp_year);
            blockchainSkills.description_commercial_platforms.should.equal(candidateEditProfileData.description_commercial_platforms);
            blockchainSkills.description_experimented_platforms.should.equal(candidateEditProfileData.description_experimented_platforms);
         })
    })
});