const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../../../users/company/companyHelpers');
const candidateHelper = require('../../../users/candidate/candidateHelpers');
const adminChatHelper = require('./adminChatHelpers');
const Chats = require('../../../../../model/chat');
const userHelper = require('../../../users/usersHelpers');
const chatHelper = require('../../../chat/chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get initial job offer msgs', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_job_desc_msgs', () => {

        it('it should get initial job offer msgs', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerfiedCompany(company);
            await userHelper.approve(company.email);

            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const messageData = docGenerator.message();
            const offerData = docGenerator.employmentOffer();
            const res = await chatHelper.sendEmploymentOffer(companyUserDoc._id,candidateUserDoc._id,messageData,offerData,companyUserDoc.jwt_token);

            const msgTag = 'job_offer';
            const messagesRes = await adminChatHelper.getInitialJobOfferDetail(companyUserDoc._id,candidateUserDoc._id,msgTag,companyUserDoc.jwt_token);
            const chatDoc = await Chats.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id}).lean();

            const returnData = messagesRes.body;
            returnData.datas.should.equal(0);
            chatDoc.sender_name.should.equal(messageData.sender_name);
            chatDoc.receiver_name.should.equal(messageData.receiver_name);
        })
    })
});