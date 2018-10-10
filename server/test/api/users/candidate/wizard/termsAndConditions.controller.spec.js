const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const candidateProfile = require('../../../../../model/candidate_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('add terms of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/terms', () => {

        it('it should add terms of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candTerms = docGenerator.termsAndConditions();
            const res = await candidateHelper.candidateTerms(candTerms,userDoc.jwt_token);
            const newCandidateInfo = await candidateProfile.findOne({_creator: userDoc._id}).lean();
            newCandidateInfo.marketing_emails.should.equal(candTerms.marketing);
            newCandidateInfo.terms.should.equal(candTerms.terms);
        })
    })
});