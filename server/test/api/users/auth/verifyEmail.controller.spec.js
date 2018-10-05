const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verify email of candidate or company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/emailVerify/:email_hash' , () =>
    {
        it('it should verify candidate email' , async () =>
        {
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            candidateRes.should.have.status(200);

            const verifyCandidate = await authenticateHepler.verifyEmail(candidateRes.body.verifyEmailKey);
            verifyCandidate.body.msg.should.equal('Email Verified');
        })

        it('it should verify company email' , async () =>
        {
            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);
            companyRes.should.have.status(200);

            const verifyCompany = await authenticateHepler.verifyEmail(companyRes.body.verifyEmailKey);
            verifyCompany.body.msg.should.equal('Email Verified');
        })

    })

});