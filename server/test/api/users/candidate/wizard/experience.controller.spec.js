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

describe('add experience of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/exp', () => {

        it('it should add experience of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.experience();
            const res = await candidateWizardHelper.experience(candidateExperience,userDoc.jwt_token);

            userDoc = await Users.findOne({email: candidate.email}).lean();

            userDoc.candidate.description.should.equal(candidateExperience.detail.intro);
            userDoc.candidate.education_history[0].uniname.should.equal(candidateExperience.education[0].uniname);
            userDoc.candidate.work_history[0].companyname.should.equal(candidateExperience.work[0].companyname);
            userDoc.candidate.programming_languages[0].language.should.equal(candidateExperience.language_exp[0].language);
        })
    })
});