const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const messagesHelpers = require('../helpers');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../otherHelpers/companyHelpers');
const candidateHelper = require('../otherHelpers/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const users = require('../../../model/mongoose/users');
const candidateHelperV2 =  require('../../api-v2/users/candidates/candidateHelpers');
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

            const candidate = docGeneratorV2.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelperV2.candidateProfile(candidate, profileData);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const approachOffer = docGeneratorV2.messages.approach(candidateuserDoc._id);
            await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

            const res = await messagesHelpers.getConversations(companyUserDoc.jwt_token);
            const conversation =  res.body['conversations'][0];
            conversation.count.should.equal(1);
            conversation.unread_count.should.equal(0);
        })
    });
});