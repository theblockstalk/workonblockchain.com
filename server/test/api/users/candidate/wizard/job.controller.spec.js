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

describe('add job of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/job', () => {

        it('it should add job of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.job();
            const res = await candidateWizardHelper.job(candidateExperience,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.locations[0].should.equal(candidateExperience.country[0]);
            newCandidateInfo.roles[0].should.equal(candidateExperience.roles[0]);
            newCandidateInfo.interest_area[0].should.equal(candidateExperience.interest_area[0]);
            newCandidateInfo.availability_day.should.equal(candidateExperience.availability_day);
            newCandidateInfo.current_currency.should.equal(candidateExperience.current_currency);
            newCandidateInfo.current_salary.should.equal(candidateExperience.current_salary);
            newCandidateInfo.expected_salary.should.equal(candidateExperience.expected_salary);
            newCandidateInfo.expected_salary_currency.should.equal(candidateExperience.base_currency);
        })
    })
});