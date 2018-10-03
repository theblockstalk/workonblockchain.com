const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHepler = require('../../helpers/companyHelpers');
const candidateHepler = require('../../helpers/candidateHelpers');
const chatHelper = require('../../helpers/chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get chat messages of a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should chat messages of a user', async () => {

            //creating a company
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupcompany(company);
            companyRes.should.have.status(200);
            await companyHepler.signupAdmincompany(company);
            await companyHepler.approveUser(company.email);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            companyDoc.email.should.equal(company.email);
            companyDoc.is_verify.should.equal(1);
            companyDoc.type.should.equal(company.type);

            //creating a candidate
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();
            candidateDoc.email.should.equal(candidate.email);
            candidateDoc.is_verify.should.equal(1);
            candidateDoc.type.should.equal(candidate.type);

            //send a message
            //sending a message
            const message = docGenerator.message();
            const insertMessageRes = await chatHelper.insertMessage(companyDoc._id,candidateDoc._id,message,companyDoc.jwt_token);
            insertMessageRes.should.have.status(200);

            const res = await chatHelper.getMessages(companyDoc._id,candidateDoc._id,companyDoc.jwt_token);
            res.should.have.status(200);
            res.body.datas[0].sender_name.should.equal(message.sender_name);
            res.body.datas[0].receiver_name.should.equal(message.receiver_name);
            res.body.datas[0].message.should.equal(message.message);
            res.body.datas[0].msg_tag.should.equal(message.msg_tag);
        })
    })
});