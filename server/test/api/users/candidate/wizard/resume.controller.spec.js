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
        //await mongo.drop();
    })

    describe('PUT /users/welcome/resume', () => {

        it('it should add resume of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateExperience = docGenerator.resume();
            const res = await candidateWizardHelper.resume(candidateExperience,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            console.log(newCandidateInfo);
        })
    })
});