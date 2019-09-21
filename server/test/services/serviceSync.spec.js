const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../helpers/mongo');

const zoho = require('../../controller/services/zoho/zoho');
const docGenerator = require('../helpers/docGenerator-v2');
const candidateHelper = require('../api-v2/users/candidates/candidateHelpers');
const companyHelper = require('../api-v2/users/companies/companyHelpers');
const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const companies = require('../../model/mongoose/companies');
const serviceSync = require('../../controller/services/serviceSync');
const sendgrid = require('../../controller/services/email/sendGrid');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const testContact = {
    email: "testingemail@workonblockchain.com",
    first_name: "PART OF AUTOMATIC UNIT TESTS",
    company_name: "PART OF AUTOMATIC UNIT TESTS"
};
const syncTestEmail = sendgrid.addEmailEnvironment(testContact.email);
const getSyncTestEmail = syncTestEmail.replace("+","%2B");

describe('service syncronization', function () {
    beforeEach(async function() {
        await zoho.initialize();
        await zoho.generateAuthTokenfromRefreshToken();
    })

    afterEach(async function () {
        console.log('removing test contact');
        let res = await zoho.contacts.search({
            params: {
                email: getSyncTestEmail
            }
        });
        if (res && res.length > 0) {
            await zoho.contacts.deleteOne({
                id: res[0].id
            });
        }
        res = await zoho.accounts.search({
            params: {
                criteria: "((Account_Name:equals:" + company.company_name + "))"
            }
        });
        if (res && res.length > 0) {
            await zoho.accounts.deleteOne({
                id: res[0].id
            });
        }
        console.log('dropping database');
        await mongo.drop();
    })

    describe('sync different documents', function () {

        it('should sync a new candidate', async function () {
            const candidate = docGenerator.candidate();
            candidate.email = testContact.email;
            candidate.first_name = testContact.first_name;

            await candidateHelper.signupCandidate(candidate);

            await serviceSync.pullFromQueue();

            const userDoc = await users.findOneByEmail(candidate.email);
            const zohoContact = await zoho.contacts.search({
                params: {
                    email: getSyncTestEmail
                }
            });
            zohoContact[0].First_Name.should.equal(userDoc.first_name);
            zohoContact[0].Candidate_status.should.equal(userDoc.candidate.latest_status.status);
            zohoContact[0].Last_Name.should.equal(userDoc.last_name);
        })

        it('should sync a patched candidate', async function () {
            const candidate = docGenerator.candidate();
            candidate.email = testContact.email;
            candidate.first_name = testContact.first_name;
            const profileData = docGenerator.candidateProfile();

            await candidateHelper.candidateProfile(candidate, profileData);

            let  candidateUserDoc = await users.findOne({email: candidate.email});
            const candidateEditProfileData = docGenerator.candidateProfileUpdate();

            await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);

            let syncDocCount = await syncQueue.count({status: 'pending'});
            expect(syncDocCount).to.equal(2, "1x POST and 1x PATCH should be found");

            await serviceSync.pullFromQueue();
            syncDocCount = await syncQueue.count({status: 'pending'});
            expect(syncDocCount).to.equal(0);

            const userDoc = await users.findOneByEmail(candidate.email);
            const zohoContact = await zoho.contacts.search({
                params: {
                    email: getSyncTestEmail
                }
            });
            zohoContact[0].Candidate_status.should.equal(userDoc.candidate.latest_status.status);
            zohoContact[0].Last_Name.should.equal(userDoc.last_name);
        })

        it('should sync a new company', async function () {
            const company = docGenerator.company();
            company.email = testContact.email;
            company.first_name = testContact.first_name;
            company.company_name = testContact.company_name;

            await companyHelper.signupCompany(company);

            await serviceSync.pullFromQueue();

            const userDoc = await users.findOneByEmail(company.email);
            const companyDoc = await companies.findOne({company_name: company.company_name});
            const zohoContact = await zoho.contacts.search({
                params: {
                    email: getSyncTestEmail
                }
            });
            const zohoAccount = await zoho.accounts.search({
                params: {
                    criteria: "((Account_Name:equals:" + company.company_name + "))"
                }
            });
            zohoContact[0].First_Name.should.equal(userDoc.first_name);
            zohoContact[0].Candidate_status.should.equal(userDoc.candidate.latest_status.status);
            zohoContact[0].Last_Name.should.equal(userDoc.last_name);
            zohoAccount[0].Account_Name.should.equal(companyDoc.company_name);
            zohoAccount[0].Account_Name.should.equal(companyDoc.company_name);
        })
    })
})