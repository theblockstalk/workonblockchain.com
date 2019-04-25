const chai = require('chai');
const chaiHttp = require('chai-http');
const date = require('date-and-time');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const messages = require('../../../../model/messages');
const Pages = require('../../../../model/pages_content');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const chatHelper = require('../../chat/chatHelpers');
const adminHelper = require('./adminHelpers');
const userHelper = require('../../users/usersHelpers');
const docGeneratorV2 = require('../../../helpers/docGenerator-v2');
const messagesHelpers = require('../../../../test/api-v2/helpers');
const companiesHelperV2 = require('../../../api-v2/users/companyHelpers')
const candidateHelperV2 = require('../../../api-v2/users/candidates/candidateHelpers')

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin search candidate by filter', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('POST /users/admin_candidate_filter', () => {

        it('it should search candidate by filter', async () => {
        const company = docGeneratorV2.company();
        await companiesHelperV2.signupCompany(company);
        const companyDoc = await Users.findOneByEmail(company.email);

        const updatedData = await docGeneratorV2.companyUpdateProfile();
        const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
        await userHelper.verifyEmail(company.email)
        await userHelper.approve(company.email);

        await userHelper.makeAdmin(company.email);
        const companyUserDoc = await Users.findOneByEmail(company.email);

        const profileData = docGeneratorV2.candidateProfile();
        const candidate = docGenerator.candidate();

        const candidateRes = await candidateHelperV2.candidateProfile(candidate,profileData);
        await userHelper.makeAdmin(candidate.email);
        await userHelper.approveCandidate(candidate.email);
        const candidateUserDoc = await Users.findOneByEmail(candidate.email);

        const approachOffer = docGeneratorV2.messages.approach(candidateUserDoc._id);
        const res = await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

        const messageDoc = await messages.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id}).lean();
        console.log(messageDoc);
        const data = {
            msg_tags : [messageDoc.msg_tag],
            is_approve : candidateUserDoc.candidate.history[0].status.status,
            word : candidate.first_name
        }
        const candidateFilterRes = await adminHelper.candidateFilter(data , candidateUserDoc.jwt_token);
        candidateFilterRes.body[0].first_name.should.equal(candidate.first_name);
        candidateUserDoc.candidate.history[0].status.status.should.equal('approved');
        messageDoc.msg_tag.should.valueOf(data.msg_tags);

    })
})
});