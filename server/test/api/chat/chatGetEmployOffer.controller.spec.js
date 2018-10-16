const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const userHelper = require('../users/usersHelpers');
const companyHelper = require('../users/company/companyHelpers');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get employment offer detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should get employment offer detail', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerfiedCompany(company);
            await userHelper.approve(company.email);

            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const messageData = docGenerator.message();
            const offerData = docGenerator.employmentOffer();
            const res = await chatHelper.sendEmploymentOffer(companyUserDoc._id,candidateUserDoc._id,messageData,offerData,companyUserDoc.jwt_token);

            const msgTag = 'employment_offer';

            const employmentOfferDetails = await chatHelper.getEmploymentOfferDetail(companyUserDoc._id, candidateUserDoc._id, msgTag, companyUserDoc.jwt_token);

            const chatDoc = await Chats.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id}).lean();
            const response = employmentOfferDetails.body;

            response.datas.should.equal(chatDoc.is_job_offered);
            chatDoc.sender_name.should.equal(messageData.sender_name);
            chatDoc.receiver_name.should.equal(messageData.receiver_name);
        })
    })
});