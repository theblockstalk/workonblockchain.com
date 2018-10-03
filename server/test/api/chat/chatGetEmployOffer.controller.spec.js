const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHepler = require('../../helpers/companyHelpers');
const candidateHepler = require('../../helpers/candidateHelpers');
const chatHelper = require('../../helpers/chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get employment offer detail', function () {

    afterEach(async () => {
        console.log('dropping database');
        //await mongo.drop();
    })

    describe('POST /users/insert_message', () => {

        it('it should get employment offer detail', async () => {

            //creating a company
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupcompany(company);
            companyRes.should.have.status(200);
            await companyHepler.signupAdmincompany(company);
            await companyHepler.approveUser(company.email);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            companyDoc.email.should.equal(company.email);
            companyDoc.is_verify.should.equal(1);
            companyDoc.type.should.equal(company.type);

            //creating a candidate
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();
            candidateDoc.email.should.equal(candidate.email);
            candidateDoc.is_verify.should.equal(1);
            candidateDoc.type.should.equal(candidate.type);
            const msgTag = 'employment_offer';

            const res = await chatHelper.getEmploymentOfferDetail(companyDoc._id,candidateDoc._id,msgTag,companyDoc.jwt_token);
            res.should.have.status(200);
            res.body.datas.should.equal(0);
        })
    })
});