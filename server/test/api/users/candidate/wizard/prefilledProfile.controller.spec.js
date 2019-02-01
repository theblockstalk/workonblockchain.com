const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
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

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const prefilledProfileData = docGenerator.prefilledProfileData();
            const res = await candidateWizardHelper.prefilledProfile(prefilledProfileData,userDoc.jwt_token);

            userDoc = await Users.findOne({email: candidate.email}).lean();
            userDoc.first_name.should.equal(prefilledProfileData.basics.first_name);
            userDoc.last_name.should.equal(prefilledProfileData.basics.last_name);
            userDoc.candidate.description.should.equal(prefilledProfileData.basics.summary);
            userDoc.candidate.education_history.uniname.should.equal(prefilledProfileData.educationHistory.uniname);
            userDoc.candidate.work_history.companyname.should.equal(prefilledProfileData.workHistory.companyname);


        })
    })
});