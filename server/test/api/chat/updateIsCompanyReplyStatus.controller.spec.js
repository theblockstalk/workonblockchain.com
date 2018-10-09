const chai = require('chai');
const chaiHttp = require('chai-http');
const date = require('date-and-time');
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

describe('update company reply status', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/update_is_company_reply_status', () => {

        it('it should update company reply status', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const initialJobOffer = docGenerator.initialJobOffer();
            const res = await chatHelper.insertMessage(companyDoc._id,userDoc._id,initialJobOffer,companyDoc.jwt_token);

            const status = 1;
            const statusRes = await chatHelper.updateStatus(userDoc._id,status,userDoc.jwt_token);
            const chatDoc = await Chats.findOne({receiver_id: userDoc._id}).lean();
            chatDoc.is_company_reply.should.equal(1);
        })
    })
});