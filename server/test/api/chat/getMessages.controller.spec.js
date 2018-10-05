const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../users/company/companyHelpers');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get chat messages of a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_messages', () => {

        it('it should chat messages of a user', async () => {

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

            const res = await chatHelper.getMessages(companyDoc._id,candidateDoc._id,companyDoc.jwt_token);
            res.body.datas[0].sender_name.should.equal(message.sender_name);
            res.body.datas[0].receiver_name.should.equal(message.receiver_name);
            res.body.datas[0].message.should.equal(message.message);
            res.body.datas[0].msg_tag.should.equal(message.msg_tag);
        })
    })
});