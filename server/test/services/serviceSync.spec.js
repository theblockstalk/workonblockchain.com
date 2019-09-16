const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../helpers/mongo');

const zoho = require('../../controller/services/zoho/zoho');
const docGenerator = require('../helpers/docGenerator-v2');
const candidateHelper = require('../api-v2/users/candidates/candidateHelpers');
const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const serviceSync = require('../../controller/services/serviceSync')

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

const testContact = {
    email: "testingemail@workonblockchain.com",
    first_name: "PART OF AUTOMATIC UNIT TESTS",
    last_name: "WILL DELETE AUTOMATICALLY"
};

describe('service syncronization', function () {
    beforeEach(async function() {
        await zoho.initialize();
        await zoho.generateAuthTokenfromRefreshToken();
    })

    afterEach(async function () {
        console.log('removing test contact');
        const res = await zoho.contacts.search({
            params: {
                email: testContact.email
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
            const candidate = docGenerator.candidate();

            await candidateHelper.signupCandidate(candidate);

            await syncQueue.updateOne({"user.email": candidate.email}, {
                $set: {
                    "user.email": testContact.email,
                    "user.first_name": testContact.first_name,
                    "user.last_name": testContact.last_name
                }
            });
            await serviceSync.pullFromQueue();
        })
    })
})