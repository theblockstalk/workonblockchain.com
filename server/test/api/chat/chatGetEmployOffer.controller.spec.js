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
            await candidateHelper.signupVerfiedCandidate(candidate);

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const msgTag = 'employment_offer';

            const employmentOfferDetails = await chatHelper.getEmploymentOfferDetail(companyUserDoc._id, candidateUserDoc._id, msgTag, companyUserDoc.jwt_token);
            const response = employmentOfferDetails.body;
            response.datas.should.equal(0);
        })
    })
});