const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../users/company/companyHelpers');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');
const Chats = require('../../../model/chat');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get user messages', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_user_messages', () => {

        it('it should get user messages', async () => {

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
            const insertRes = await chatHelper.insertMessage(companyDoc._id,candidateDoc._id,message,companyDoc.jwt_token);

            const res = await chatHelper.getUserMessages(candidateDoc._id,companyDoc.jwt_token);
            const chatRes = await Chats.findOne({sender_id : companyDoc._id}).lean();

            const responseMessage = res.body.datas[0];

            responseMessage.is_company_reply.should.equal(1);
            responseMessage.receiver_id.should.equal(candidateDoc._id.toString());
            responseMessage.sender_id.should.equal(companyDoc._id.toString());
            chatRes.sender_name.should.equal(message.sender_name);
            chatRes.message.should.equal(message.message);

        })
    })
});