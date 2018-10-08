const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('../candidate/candidateHelpers');
const referralsHelper = require('./referralsHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('send email to user who referred this person', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/refered_user_email', () => {

        it('it should send email to user who referred this person', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const emailInfo = docGenerator.referredEmailDocs();
            const email = userDoc.email;
            const firstName = emailInfo.firstnameOfReferee;
            const referredFirstName = emailInfo.referred_fname;
            const referredLastName = emailInfo.referred_lname;
            await referralsHelper.sendEmail(email,firstName,referredFirstName,referredLastName);
        })
    })
});