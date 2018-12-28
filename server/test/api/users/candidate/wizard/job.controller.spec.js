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

describe('add job of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/job', () => {

        it('it should add job of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.job();
            const res = await candidateWizardHelper.job(candidateExperience,userDoc.jwt_token);

            userDoc = await Users.findOne({email: candidate.email}).lean();
            userDoc.candidate.locations[0].should.equal(candidateExperience.country[0]);
            userDoc.candidate.roles[0].should.equal(candidateExperience.roles[0]);
            userDoc.candidate.interest_areas[0].should.equal(candidateExperience.interest_areas[0]);
            userDoc.candidate.availability_day.should.equal(candidateExperience.availability_day);
            userDoc.candidate.current_currency.should.equal(candidateExperience.current_currency);
            userDoc.candidate.current_salary.should.equal(candidateExperience.current_salary);
            userDoc.candidate.expected_salary.should.equal(candidateExperience.expected_salary);
            userDoc.candidate.expected_salary_currency.should.equal(candidateExperience.base_currency);
        })
    })
});