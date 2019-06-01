const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const candidateHepler = require('../../otherHelpers/candidateHelpers');
const docGenerator = require('../../../helpers/docGenerator');
const userHelpers = require('../usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('verify email of candidate or company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PATCH /v2/users/email' , () =>
    {
        it('it should verify user email' , async () =>
        {
            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupCandidate(candidate);
            
            let candidateUserDoc = await Users.findOne({email: candidate.email});
            candidateUserDoc.is_verify.should.equal(0);

            const verifyCandidate = await userHelpers.verifyEmail(candidateUserDoc.verify_email_key);

            candidateUserDoc = await Users.findOne({email: candidate.email});
            candidateUserDoc.is_verify.should.equal(1);
        })


    })

});