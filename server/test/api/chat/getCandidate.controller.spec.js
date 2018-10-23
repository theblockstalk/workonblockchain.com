const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
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

describe('get a candidate or company info', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should get a candidate or company info', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();
            const isCompanyReply = 1;

            const userDetails = await chatHelper.getUserInfo(companyDoc._id,candidateDoc._id,isCompanyReply,candidate.type,companyDoc.jwt_token);
            const response = userDetails.body;
            response.users._creator.email.should.equal(candidate.email);
            response.users._creator.type.should.equal(candidate.type);
        })
    })
});