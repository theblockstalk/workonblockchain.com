const chai = require('chai');
const chaiHttp = require('chai-http');
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

describe('send a message', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should send a message', async () => {

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

            const chatDoc = await Chats.findOne({sender_id: companyDoc._id,receiver_id: userDoc._id}).lean();
            chatDoc.is_company_reply.should.equal(initialJobOffer.is_company_reply);
            chatDoc.sender_name.should.equal(initialJobOffer.sender_name);
            chatDoc.receiver_name.should.equal(initialJobOffer.receiver_name);
            chatDoc.message.should.equal(initialJobOffer.message);
            chatDoc.description.should.equal(initialJobOffer.description);
            chatDoc.job_title.should.equal(initialJobOffer.job_title);
            chatDoc.salary.should.equal(initialJobOffer.salary);
            chatDoc.salary_currency.should.equal(initialJobOffer.currency);
            chatDoc.msg_tag.should.equal(initialJobOffer.msg_tag);
            chatDoc.job_type.should.equal(initialJobOffer.job_type);
            chatDoc.interview_location.should.equal(initialJobOffer.interview_location);
         })
    })
});