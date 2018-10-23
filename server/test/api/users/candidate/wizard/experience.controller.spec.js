const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const candidateProfile = require('../../../../../model/candidate_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../candidateHelpers');
const candidateWizardHelper = require('./candidateWizardHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('add experience of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/exp', () => {

        it('it should add experience of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.experience();
            const res = await candidateWizardHelper.experience(candidateExperience,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.description.should.equal(candidateExperience.detail.intro);
            newCandidateInfo.education_history[0].uniname.should.equal(candidateExperience.education[0].uniname);
            newCandidateInfo.work_history[0].companyname.should.equal(candidateExperience.work[0].companyname);
            newCandidateInfo.programming_languages[0].language.should.equal(candidateExperience.language_exp[0].language);
        })
    })
});