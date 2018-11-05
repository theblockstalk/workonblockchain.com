const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const candidateProfile = require('../../../../../model/candidate_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../candidateHelpers');
const candidateWizardHelper = require('./candidateWizardHelpers');

chai.use(chaiHttp);

describe('prefilled profile of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/prefilled_profile', () => {

        it('it should prefill some fields from linkedin zip file in candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const prefilledProfileData = docGenerator.prefilledProfileData();
            const res = await candidateWizardHelper.prefilledProfile(prefilledProfileData,userDoc.jwt_token);

            res.body.success.should.equal(true);

            const candidateDoc = await candidateProfile.findOne({_creator : userDoc._id}).lean();
            candidateDoc.first_name.should.equal(prefilledProfileData.basics.first_name);
            candidateDoc.last_name.should.equal(prefilledProfileData.basics.last_name);
            candidateDoc.description.should.equal(prefilledProfileData.basics.summary);
            candidateDoc.education_history[0].uniname.should.equal(prefilledProfileData.educationHistory.uniname);
            candidateDoc.work_history[0].companyname.should.equal(prefilledProfileData.workHistory.companyname);


        })
    })
});