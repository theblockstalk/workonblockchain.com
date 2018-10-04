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

describe('upload chat file', function () {

    afterEach(async () => {
        console.log('dropping database');
        //await mongo.drop();
    })

    describe('POST /users/upload_chat_file', () => {

        it('it should upload chat file', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHepler.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const messageData = docGenerator.message();
            const chatFileData = docGenerator.chatFile();
            const fileName = 'my-test.jpg';
            const res = await chatHelper.uploadFile(userDoc._id,fileName,userDoc.jwt_token);
        })
    })
});