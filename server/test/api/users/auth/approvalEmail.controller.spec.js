const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const Companies = require('../../../../model/employer_profile');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('account approval email' , function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/approval_email' , () => {

        it('it should sent account approval email to company or candidate' , async() => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            let userDoc = await Users.findOne({email: company.email}).lean();

            const accountSetting = await authenticateHepler.approvalEmail(userDoc.type, userDoc.email,userDoc.name,userDoc.jwt_token);
            accountSetting.body.success.should.equal(true);
        })
    })
})