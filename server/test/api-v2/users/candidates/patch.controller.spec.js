const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const users = require('../../../../model/mongoose/users');
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

    describe('Patch /users/user_id/candidates', function() {

        it('it should update candidate profile', async function() {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.candidateProfile();

            await candidateHelper.candidateProfile(candidate, profileData);

            let  candidateUserDoc = await users.findOne({email: candidate.email});
            const candidateEditProfileData = docGenerator.candidateProfileUpdate();

            const res = await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
            candidateUserDoc = await users.findOne({email: candidate.email});
            console.log(candidateUserDoc);
            candidateUserDoc.candidate.github_account.should.equal(candidateEditProfileData.candidate.github_account);
            candidateUserDoc.candidate.stackexchange_account.should.equal(candidateEditProfileData.candidate.stackexchange_account);
            candidateUserDoc.contact_number.should.equal(candidateEditProfileData.contact_number);
            candidateUserDoc.candidate.employee.location.should.valueOf(candidateEditProfileData.candidate.employee.location);
            candidateUserDoc.candidate.employee.roles.should.valueOf(candidateEditProfileData.candidate.employee.roles);
            candidateUserDoc.candidate.interest_areas.should.valueOf(candidateEditProfileData.candidate.interest_areas);
            candidateUserDoc.candidate.education_history.should.valueOf(candidateEditProfileData.candidate.education_history);
            candidateUserDoc.candidate.work_history.should.valueOf(candidateEditProfileData.candidate.work_history);
            candidateUserDoc.candidate.base_city.should.equal(candidateEditProfileData.candidate.base_city);
            candidateUserDoc.candidate.commercial_skills[0].name.should.equal(candidateEditProfileData.candidate.commercial_skills[0].name);
            candidateUserDoc.candidate.commercial_skills[0].exp_year.should.equal(candidateEditProfileData.candidate.commercial_skills[0].exp_year);
            candidateUserDoc.candidate.description_commercial_skills.should.equal(candidateEditProfileData.candidate.description_commercial_skills);
        });

        it('it should update link sites', async function() {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.candidateProfile();

            await candidateHelper.candidateProfile(candidate, profileData);

            let  candidateUserDoc = await users.findOne({email: candidate.email});
            let candidateEditProfileData = docGenerator.candidateProfileUpdate();

            const res = await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);

            candidateEditProfileData = {
                unset_github_account: true,
                unset_linkedin_account: true
            };
            const resNew = await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);

        })
    })
});