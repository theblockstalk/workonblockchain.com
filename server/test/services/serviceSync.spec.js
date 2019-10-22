const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../helpers/mongo');

const zoho = require('../../controller/services/zoho/zoho');
const docGenerator = require('../helpers/docGenerator-v2');
const candidateHelper = require('../api-v2/users/candidates/candidateHelpers');
const companyHelper = require('../api-v2/users/companies/helpers');
const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const companies = require('../../model/mongoose/companies');
const serviceSync = require('../../controller/services/serviceSync');
const sendgrid = require('../../controller/services/email/sendGrid');
const settings = require('../../settings');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const testContact = {
    email: "testingemail@workonblockchain.com",
    first_name: "PART OF AUTOMATIC UNIT TESTS - " + settings.ENVIRONMENT,
    company_name: "PART OF AUTOMATIC UNIT TESTS - " + settings.ENVIRONMENT
};
const syncTestEmail = serviceSync.addEmailEnvironment(testContact.email);
const getSyncTestEmail = syncTestEmail.replace("+","%2B");

describe('service syncronization', function () {
    this.timeout(10000);

    beforeEach(async function() {
        if (settings.ENVIRONMENT === 'test-all') {
            await zoho.initialize();
            await zoho.generateAuthTokenfromRefreshToken();
        }
    })

    afterEach(async function () {
        if (settings.ENVIRONMENT === 'test-all') {
            console.log('removing test contact');
            let res = await zoho.contacts.search({
                params: {
                    email: getSyncTestEmail
                }
            });
            if (res.data && res.data.length > 0) {
                await zoho.contacts.deleteOne({
                    id: res.data[0].id
                });
            }
            res = await zoho.accounts.search({
                params: {
                    criteria: "((Account_Name:equals:" + testContact.company_name + "))"
                }
            });
            if (res && res.data && res.data.length > 0) {
                await zoho.accounts.deleteOne({
                    id: res.data[0].id
                });
            }
            console.log('dropping database');
            await mongo.drop();
        }
    })

    describe('sync different documents', function () {

        // it('should sync a new candidate', async function () {
        //     if (settings.ENVIRONMENT === 'test-all') {
        //         const candidate = docGenerator.candidate();
        //         candidate.email = testContact.email;
        //         candidate.first_name = testContact.first_name;
        //
        //         await candidateHelper.signupCandidate(candidate);
        //
        //         await serviceSync.pullFromQueue();
        //
        //         const userDoc = await users.findOneByEmail(candidate.email);
        //         const res = await zoho.contacts.search({
        //             params: {
        //                 email: getSyncTestEmail
        //             }
        //         });
        //         const zohoContact = res.data[0];
        //         zohoContact.First_Name.should.equal(userDoc.first_name);
        //         zohoContact.Candidate_status.should.equal(userDoc.candidate.latest_status.status);
        //         zohoContact.Last_Name.should.equal(userDoc.last_name);
        //     }
        // })
        //
        // it('should sync a patched candidate', async function () {
        //     if (settings.ENVIRONMENT === 'test-all') {
        //         const candidate = docGenerator.candidate();
        //         candidate.email = testContact.email;
        //         candidate.first_name = testContact.first_name;
        //         const profileData = docGenerator.candidateProfile();
        //
        //         await candidateHelper.candidateProfile(candidate, profileData);
        //
        //         let  candidateUserDoc = await users.findOne({email: candidate.email});
        //         const candidateEditProfileData = docGenerator.candidateProfileUpdate();
        //
        //         await candidateHelper.candidateProfilePatch(candidateUserDoc._id ,candidateUserDoc.jwt_token, candidateEditProfileData);
        //
        //         let syncDocCount = await syncQueue.count({status: 'pending'});
        //         expect(syncDocCount).to.equal(2, "1x POST and 1x PATCH should be found");
        //
        //         await serviceSync.pullFromQueue();
        //         syncDocCount = await syncQueue.count({status: 'pending'});
        //         expect(syncDocCount).to.equal(0);
        //
        //         const userDoc = await users.findOneByEmail(candidate.email);
        //         const res = await zoho.contacts.search({
        //             params: {
        //                 email: getSyncTestEmail
        //             }
        //         });
        //         const zohoContact = res.data[0];
        //         zohoContact.Candidate_status.should.equal(userDoc.candidate.latest_status.status);
        //         zohoContact.Last_Name.should.equal(userDoc.last_name);
        //     }
        // })
        //
        // it('should sync a new company', async function () {
        //     if (settings.ENVIRONMENT === 'test-all') {
        //         const company = docGenerator.company();
        //         company.email = testContact.email;
        //         company.first_name = testContact.first_name;
        //         company.company_name = testContact.company_name;
        //
        //         await companyHelper.signupCompany(company);
        //
        //         await serviceSync.pullFromQueue();
        //
        //         const userDoc = await users.findOneByEmail(company.email);
        //         const companyDoc = await companies.findOne({company_name: company.company_name});
        //         let res = await zoho.contacts.search({
        //             params: {
        //                 email: getSyncTestEmail
        //             }
        //         });
        //         const zohoContact = res.data[0];
        //         res = await zoho.accounts.search({
        //             params: {
        //                 criteria: "((Account_Name:equals:" + company.company_name + "))"
        //             }
        //         });
        //         const zohoAccount = res.data[0];
        //         zohoContact.First_Name.should.equal(companyDoc.first_name);
        //         zohoContact.Last_Name.should.equal(companyDoc.last_name);
        //         zohoContact.Contact_type[0].should.equal("company");
        //         zohoContact.Account_Name.id.should.equal(zohoAccount.id);
        //         zohoContact.Platform_ID.should.equal(userDoc._id.toString());
        //
        //         zohoAccount.Account_Name.should.equal(companyDoc.company_name);
        //         zohoAccount.Account_status.should.equal("Active");
        //         zohoAccount.Billing_Country.should.equal(companyDoc.company_country);
        //     }
        // })
        //
        // it('should sync an updated company', async function () {
        //     if (settings.ENVIRONMENT === 'test-all') {
        //         const company = docGenerator.company();
        //         company.email = testContact.email;
        //         company.first_name = testContact.first_name;
        //         company.company_name = testContact.company_name;
        //
        //         await companyHelper.signupCompany(company);
        //         const companyUserDoc = await users.findOneByEmail(company.email);
        //
        //         const updatedData = await docGenerator.companyUpdateProfile();
        //         delete updatedData.company_name;
        //         await companyHelper.companyProfileData(companyUserDoc._creator, companyUserDoc.jwt_token , updatedData);
        //
        //         let syncDocCount = await syncQueue.count({status: 'pending'});
        //         expect(syncDocCount).to.equal(2, "1x POST and 1x PATCH should be found");
        //
        //         await serviceSync.pullFromQueue();
        //
        //         syncDocCount = await syncQueue.count({status: 'pending'});
        //         expect(syncDocCount).to.equal(0);
        //
        //         const companyDoc = await companies.findOne({company_name: company.company_name});
        //         let res = await zoho.contacts.search({
        //             params: {
        //                 email: getSyncTestEmail
        //             }
        //         });
        //         const zohoContact = res.data[0];
        //         res = await zoho.accounts.search({
        //             params: {
        //                 criteria: "((Account_Name:equals:" + company.company_name + "))"
        //             }
        //         });
        //         const zohoAccount = res.data[0];
        //         zohoContact.First_Name.should.equal(companyDoc.first_name);
        //         zohoContact.Last_Name.should.equal(companyDoc.last_name);
        //         zohoContact.Contact_type[0].should.equal("company");
        //         zohoContact.Account_Name.id.should.equal(zohoAccount.id);
        //
        //         zohoAccount.Account_Name.should.equal(companyDoc.company_name);
        //         zohoAccount.Account_status.should.equal("Active");
        //         zohoAccount.Billing_Country.should.equal(companyDoc.company_country);
        //     }
        // })
    })
})

describe('email transformations', function() {
    it('it should add environment to regular email', async function() {
        let email = "jack@example.com";
        let newEmail = serviceSync.addEmailEnvironment(email);
        newEmail.should.equal("jack+wob_"+settings.ENVIRONMENT+"_environment@example.com");
    })

    it('it should add environment to email with +', async function() {
        let email = "jack+test1@example.com";
        let newEmail = serviceSync.addEmailEnvironment(email);
        newEmail.should.equal("jack+test1_wob_"+settings.ENVIRONMENT+"_environment@example.com");
    })

    it('it should remove environment to regular email', async function() {
        let email = "jack+wob_"+settings.ENVIRONMENT+"_environment@example.com";
        let newEmail = serviceSync.removeEmailEnvironment(email);
        newEmail.should.equal("jack@example.com");
    })

    it('it should remove environment to email with +', async function() {
        let email = "jack+test1_wob_"+settings.ENVIRONMENT+"_environment@example.com";
        let newEmail = serviceSync.removeEmailEnvironment(email);
        newEmail.should.equal("jack+test1@example.com");
    })
})
