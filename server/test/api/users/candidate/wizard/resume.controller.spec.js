const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
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

            userDoc = await Users.findOne({email: candidate.email}).lean();
            const blockchainSkills = userDoc.candidate.blockchain;

            userDoc.candidate.why_work.should.equal(candidateExperience.why_work);
            blockchainSkills.experimented_platforms[0].name.should.equal(candidateExperience.experimented_platforms[0].name);
            blockchainSkills.experimented_platforms[0].checked.should.equal(candidateExperience.experimented_platforms[0].checked);
            blockchainSkills.smart_contract_platforms[0].name.should.equal(candidateExperience.smart_contract_platforms[0].name);
            blockchainSkills.smart_contract_platforms[0].exp_year.should.equal(candidateExperience.smart_contract_platforms[0].exp_year);
            blockchainSkills.commercial_skills[0].skill.should.equal(candidateExperience.commercial_skills[0].skill);
            blockchainSkills.commercial_skills[0].exp_year.should.equal(candidateExperience.commercial_skills[0].exp_year);
            blockchainSkills.formal_skills[0].skill.should.equal(candidateExperience.formal_skills[0].skill);
            blockchainSkills.formal_skills[0].exp_year.should.equal(candidateExperience.formal_skills[0].exp_year);


        })
    })
});