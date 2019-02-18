const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const messagesHelpers = require('../helpers');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const users = require('../../../model/mongoose/users');

chai.use(chaiHttp);

describe('GET /conversations', function () {
    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    });

    describe('getting conversations', function () {

        it('it should get conversations', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate,profileData,job,resume,experience);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const res = await messagesHelpers.getConversations(companyUserDoc.jwt_token);
            const conversation =  res.body['conversations'][0];
            conversation.count.should.equal(1);
            conversation.unread_count.should.equal(0);
        })
    });
});