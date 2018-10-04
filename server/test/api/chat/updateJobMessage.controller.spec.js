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

describe('updat job message status', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/update_job_message', () => {

        it('it should updat job message status', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHepler.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHepler.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            //sending job offer message
            const messageData = docGenerator.message();
            const offerData = docGenerator.employmentOffer();
            const res = await chatHelper.sendEmploymentOffer(companyDoc._id,userDoc._id,messageData,offerData,companyDoc.jwt_token);

            const messagesRes = await chatHelper.getMessages(companyDoc._id,userDoc._id,companyDoc.jwt_token);

            const status = 1;
            const updateRes = await chatHelper.updateJobStatus(messagesRes.body.datas[0]._id,status,userDoc.jwt_token);
            updateRes.body.is_job_offered.should.equal(1);
        })
    })
});