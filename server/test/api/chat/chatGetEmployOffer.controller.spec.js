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
const mongoose = require('mongoose');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get employment offer detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_employ_offer', () => {

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

            const messagesRes = await chatHelper.getMessages(companyUserDoc._id,candidateUserDoc._id,companyUserDoc.jwt_token);

            const status = 1;
            const updateRes = await chatHelper.updateJobStatus(messagesRes.body.datas[0]._id,status,candidateUserDoc.jwt_token);

            const msgTag = 'employment_offer';

            const employmentOfferDetails = await chatHelper.getEmploymentOfferDetail(companyUserDoc._id, candidateUserDoc._id, msgTag, companyUserDoc.jwt_token);
            const response = employmentOfferDetails.body;

            const chatDoc = await Chats.findOne({sender_id: companyUserDoc._id}).lean();

            chatDoc.message.should.equal(offerData.message);
            chatDoc.description.should.equal(offerData.description);
            chatDoc.job_title.should.equal(offerData.job_title);
            chatDoc.salary.should.equal(offerData.salary);
            chatDoc.salary_currency.should.equal(offerData.currency);
            chatDoc.job_type.should.equal(offerData.job_type);
            chatDoc.msg_tag.should.equal(offerData.msg_tag);
            chatDoc.is_job_offered.should.equal(1);

        })
    })
});