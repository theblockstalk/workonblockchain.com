const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Chats = require('../../../../../model/chat');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../../../users/company/companyHelpers');
const candidateHelper = require('../../../users/candidate/candidateHelpers');
const adminChatHelper = require('./adminChatHelpers');
const chatHelper = require('../../../chat/chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update chat message status to read', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/update_chat_msg_status', () => {

        it('it should update chat message status to read', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const message = docGenerator.message();
            await chatHelper.insertMessage(companyDoc._id,candidateDoc._id,message,companyDoc.jwt_token);

            const chatDoc = await Chats.findOne({receiver_id: candidateDoc._id}).lean();

            const res = await adminChatHelper.setUnreadMessageStatus(companyDoc._id,candidateDoc._id,chatDoc.is_read,candidateDoc.jwt_token);

            chatDoc.sender_name.should.equal(message.sender_name);
            chatDoc.receiver_name.should.equal(message.receiver_name);
            chatDoc.message.should.equal(message.message);
            res.body.is_read.should.equal(1);

        })
    })
});