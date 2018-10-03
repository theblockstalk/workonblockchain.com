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

describe('send a message', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should send a message', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHepler.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            // companyDoc.email.should.equal(company.email);
            // companyDoc.is_verify.should.equal(1);
            // companyDoc.is_admin.should.equal(1);
            // companyDoc.is_approved.should.equal(1);
            // should.exist(companyDoc.jwt_token)

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHepler.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();
            // userDoc.email.should.equal(candidate.email);
            // userDoc.is_verify.should.equal(1);
            // userDoc.is_approved.should.equal(1);
            // should.exist(userDoc.jwt_token)

            //checking if initial job offer is sent or not
            /*const initialJobOfferRes = await chatHelper.getInitialJobOfferDetail(companyDoc._id,userDoc._id,initialJobOffer.msg_tag,companyDoc.jwt_token);
            initialJobOfferRes.should.have.status(200);
            initialJobOfferRes.body.datas.should.equal(0);*/

            //sending a message
            const initialJobOffer = docGenerator.initialJobOffer();
            await chatHelper.insertMessage(companyDoc._id,userDoc._id,initialJobOffer,companyDoc.jwt_token);

            const chatDoc = await Chats.findOne({sender_id: companyDoc._id,receiver_id: userDoc._id}).lean();
            //chatDoc.sender_id.should.equal(companyDoc._id);
            //chatDoc.receiver_id.should.equal(userDoc._id);
            chatDoc.is_company_reply.should.equal(initialJobOffer.is_company_reply);
            chatDoc.sender_name.should.equal(initialJobOffer.sender_name);
            chatDoc.receiver_name.should.equal(initialJobOffer.receiver_name);
            chatDoc.message.should.equal(initialJobOffer.message);
            chatDoc.description.should.equal(initialJobOffer.description);
            chatDoc.job_title.should.equal(initialJobOffer.job_title);
            chatDoc.salary.should.equal(initialJobOffer.salary);
            chatDoc.salary_currency.should.equal(initialJobOffer.currency);
            //chatDoc.date_of_joining.should.equal(initialJobOffer.date_of_joining);
            chatDoc.msg_tag.should.equal(initialJobOffer.msg_tag);
            chatDoc.job_type.should.equal(initialJobOffer.job_type);
            chatDoc.interview_location.should.equal(initialJobOffer.interview_location);
            //chatDoc.interview_date_time.should.equal(initialJobOffer.interview_date_time);
        })
    })
});