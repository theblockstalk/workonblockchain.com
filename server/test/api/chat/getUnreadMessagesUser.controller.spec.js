const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../users/company/companyHelpers');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get unread messages of a user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_unread_msgs_of_user', () => {

        it('it should get unread messages of a user', async () => {

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

            const res = await chatHelper.getUnreadMessages(companyDoc._id,candidateDoc._id,candidateDoc.jwt_token);

            res.body.number_of_unread_msgs.should.equal(1);
            res.body.sender_id.should.equal(companyDoc._id.toString());
            res.body.receiver_id.should.equal(candidateDoc._id.toString())
        })
    })
});