const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../helpers/mongo');

const zoho = require('../../controller/services/zoho/zoho');
const docGenerator = require('../helpers/docGenerator-v2');
const candidateHelper = require('../api-v2/users/candidates/candidateHelpers');
const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const serviceSync = require('../../controller/services/serviceSync');
const sendgrid = require('../../controller/services/email/sendGrid');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const testContact = {
    email: "testingemail@workonblockchain.com",
    first_name: "PART OF AUTOMATIC UNIT TESTS",
    last_name: "WILL DELETE AUTOMATICALLY"
};
const syncTestEmail = sendgrid.addEmailEnvironment(testContact.email);

describe('service syncronization', function () {
    beforeEach(async function() {
        await zoho.initialize();
        await zoho.generateAuthTokenfromRefreshToken();
    })

    afterEach(async function () {
        console.log('removing test contact');
        const res = await zoho.contacts.search({
            params: {
                email: syncTestEmail
            }
        });
        await zoho.contacts.deleteOne({
            id: res[0].id
        });
        console.log('dropping database');
        await mongo.drop();
    })

    describe('sync different documents', function () {

        it('should sync a new candidate', async function () {
            const zohoContact2 = await zoho.contacts.search({
                params: {
                    email: testContact.email
                }
            });

            const candidate = docGenerator.candidate();
            candidate.email = testContact.email;
            candidate.first_name = testContact.first_name;
            candidate.last_name = testContact.last_name;

            await candidateHelper.signupCandidate(candidate);

            await serviceSync.pullFromQueue();

            const userDoc = await users.findOneByEmail(candidate.email);
            const zohoContact = await zoho.contacts.search({
                params: {
                    email: syncTestEmail
                }
            });
            zohoContact[0].First_Name.should.be(userDoc.first_name);
            zohoContact[0].Candidate_status.should.be(userDoc.candidate.latest_status.status);
            zohoContact[0].Last_Name.should.be(userDoc.last_name);
        })

        it('should sync a patched candidate', async function () {
            const candidate = docGenerator.candidate();
            const profileData = docGenerator.candidateProfile();

            await candidateHelper.candidateProfile(candidate, profileData);

            let  candidateUserDoc = await users.findOne({email: candidate.email});
            const candidateEditProfileData = docGenerator.candidateProfileUpdate();

            await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);

            await serviceSync.pullFromQueue();

            let syncDocCount = await syncQueue.count({status: 'pending'});
            expect(syncDocCount).to.be(3);
            const userDoc = await users.findOneByEmail(candidate.email);
            const zohoContact = await zoho.contacts.search({
                params: {
                    email: syncTestEmail
                }
            });
            zohoContact[0].First_Name.should.be(userDoc.first_name);
            zohoContact[0].Candidate_status.should.be(userDoc.candidate.latest_status.status);
            zohoContact[0].Last_Name.should.be(userDoc.last_name);
        })
    })
})