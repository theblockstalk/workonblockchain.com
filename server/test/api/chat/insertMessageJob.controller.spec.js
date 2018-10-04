const chai = require('chai');
const chaiHttp = require('chai-http');
const date = require('date-and-time');
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

describe('send an employment offer to candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message_job', () => {

        it('it should send an employment offer to candidate', async () => {

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
            const offerData = docGenerator.employmentOffer();
            const res = await chatHelper.sendEmploymentOffer(companyDoc._id,userDoc._id,messageData,offerData,companyDoc.jwt_token);

            const chatDoc = await Chats.findOne({sender_id: companyDoc._id,receiver_id: userDoc._id}).lean();
            chatDoc.is_company_reply.should.equal(messageData.is_company_reply);
            chatDoc.sender_name.should.equal(messageData.sender_name);
            chatDoc.receiver_name.should.equal(messageData.receiver_name);
            chatDoc.message.should.equal(offerData.message);
            chatDoc.description.should.equal(offerData.description);
            chatDoc.job_title.should.equal(offerData.job_title);
            chatDoc.salary.should.equal(offerData.salary);
            chatDoc.salary_currency.should.equal(offerData.currency);
            const current_date = new Date(chatDoc.date_of_joining);
            const my_date = date.format(current_date, 'MM-DD-YYYY');
            my_date.should.equal(offerData.date_of_joining);
            chatDoc.msg_tag.should.equal(offerData.msg_tag);
            chatDoc.job_type.should.equal(offerData.job_type);
        })
    })
});