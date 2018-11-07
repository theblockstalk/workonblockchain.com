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

describe('add resume of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/resume', () => {

        it('it should add resume of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.resume();

            const res = await candidateWizardHelper.resume(candidateExperience,userDoc.jwt_token);
            res.body.success.should.equal(true);

            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.experimented_platform[0].name.should.equal(candidateExperience.experimented_platform[0].name);
            newCandidateInfo.experimented_platform[0].checked.should.equal(candidateExperience.experimented_platform[0].checked);
            newCandidateInfo.platforms[0].platform_name.should.equal(candidateExperience.platforms[0].platform_name);
            newCandidateInfo.platforms[0].exp_year.should.equal(candidateExperience.platforms[0].exp_year);
            newCandidateInfo.why_work.should.equal(candidateExperience.why_work);

            userDoc = await Users.findOne({email: candidate.email}).lean();
            const blockchainSkills = userDoc.candidate.blockchain;

            blockchainSkills.commercial_skills[0].skill.should.equal(candidateExperience.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateExperience.commercial_skills[0].exp_year);
            blockchainSkills.formal_skills[0].skill.should.equal(candidateExperience.formal_skills[0].skill);
            blockchainSkills.formal_skills[0].exp_year.should.equal(candidateExperience.formal_skills[0].exp_year);


        })
    })
});