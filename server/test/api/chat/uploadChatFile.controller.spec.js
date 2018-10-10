const chai = require('chai');
const chaiHttp = require('chai-http');
const FormData = require('form-data');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('upload chat file', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/upload_chat_file', () => {

        it('it should upload chat file', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const formData = new FormData();
            const messageData = docGenerator.message();
            const chatFileData = docGenerator.chatFile();

            const file = docGenerator.image();

            const res = await chatHelper.uploadFile(userDoc._id,file,userDoc.jwt_token);
            const chatRes = await Chats.findOne({sender_id : userDoc._id}).lean();
        })
    })
});