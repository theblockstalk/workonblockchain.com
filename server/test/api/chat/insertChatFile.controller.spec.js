const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHepler = require('../users/company/companyHelpers');
const candidateHepler = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('send a file in chat', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_chat_file', () => {

        it('it should send a file in chat', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHepler.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHepler.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const messageData = docGenerator.message();
            const chatFileData = docGenerator.chatFile();
            const res = await chatHelper.insertChatFile(companyDoc._id,userDoc._id,messageData,chatFileData,companyDoc.jwt_token);

            const chatDoc = await Chats.findOne({sender_id: companyDoc._id,receiver_id: userDoc._id}).lean();
            chatDoc.is_company_reply.should.equal(messageData.is_company_reply);
            chatDoc.sender_name.should.equal(messageData.sender_name);
            chatDoc.receiver_name.should.equal(messageData.receiver_name);
            chatDoc.message.should.equal(chatFileData.message);
            chatDoc.job_title.should.equal(messageData.job_title);
            chatDoc.msg_tag.should.equal(messageData.msg_tag);
            chatDoc.job_type.should.equal(messageData.job_type);
            chatDoc.file_name.should.equal(chatFileData.file_name);
        })
    })
});