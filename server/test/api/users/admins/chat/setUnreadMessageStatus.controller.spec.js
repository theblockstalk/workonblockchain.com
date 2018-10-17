const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../../../users/company/companyHelpers');
const candidateHelper = require('../../../users/candidate/candidateHelpers');
const adminChatHelper = require('./adminChatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('set unread message status for receiving email', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/set_unread_msgs_emails_status', () => {

        it('it should set unread message status for receiving email', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const status = 1;
            const messagesRes = await adminChatHelper.setUnreadMessageNotificationStatus(userDoc._id,status,userDoc.jwt_token);
            const newUserDoc = await Users.findOne({_id: userDoc._id}).lean();
            newUserDoc.is_unread_msgs_to_send.should.equal(true);
        })
    })
});