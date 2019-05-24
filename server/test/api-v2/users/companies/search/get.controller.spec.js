const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const messages = require('../../../../../model/mongoose/messages');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../../../../../../server/test/api/users/candidate/candidateHelpers');
const companyHelper = require('../companyHelpers');
const userHelper = require('../../../../../../server/test/api/users/usersHelpers');
const docGeneratorV2 = require('../../../../helpers/docGenerator-v2');
const messagesHelpers = require('../../../../../test/api-v2/helpers');
const companiesHelperV2 = require('../../../../api-v2/users/companies/companyHelpers')

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin search company by filter', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('POST /v2/users/companies/search', () => {

        it('it should search company by filter', async () => {
        const company = docGeneratorV2.company();
        await companiesHelperV2.signupCompany(company);
        const companyDoc = await Users.findOneByEmail(company.email);

        const updatedData = await docGeneratorV2.companyUpdateProfile();
        const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
        await userHelper.makeAdmin(updateRes.body._creator.email);
        await userHelper.verifyEmail(updateRes.body._creator.email);
        await userHelper.approve(updateRes.body._creator.email);
        const companyUserDoc = await Users.findOneByEmail(company.email);

        const candidate = docGenerator.candidate();
        const profileData = docGenerator.profileData();
        const job = docGenerator.job();
        const resume = docGenerator.resume();
        const experience = docGenerator.experience();
        const candidateRes = await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );
        await userHelper.makeAdmin(candidate.email);
        const candidateUserDoc = await Users.findOneByEmail(candidate.email);

        const approachOffer = docGeneratorV2.messages.approach(candidateUserDoc._id);
        const res = await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

        const messageDoc = await messages.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id});
        const data = {
            msg_tags : [messageDoc.msg_tag,'reject'],
            is_approved : 1,
            search_word : updatedData.company_name
        };
        const companyFilterRes = await companyHelper.companyFilter(data , companyUserDoc.jwt_token);
        companyFilterRes.body[0].company_name.should.equal(updatedData.company_name);
        companyUserDoc.is_approved.should.equal(data.is_approved);
        messageDoc.msg_tag.should.valueOf(data.msg_tags);

    })
})
});