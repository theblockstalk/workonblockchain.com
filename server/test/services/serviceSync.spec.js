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

describe('service syncronization', function () {
    beforeEach(async function() {
        await zoho.initialize();
        await zoho.generateAuthTokenfromRefreshToken();
    })

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('sync different documents', function () {

        it('should sync for a POST candidate', async function () {
            const candidate = docGenerator.candidate();

            await candidateHelper.signupCandidate(candidate);
            // const userDoc = await users.findOneByEmail(candidate.email);

            await syncQueue.updateOne({"user.email": candidate.email}, {
                $set: {
                    "user.email": "testingemail@workonblockchain.com",
                    "user.first_name": "PART OF AUTOMATIC UNIT TESTS",
                    "user.last_name": "WILL DELETE AUTOMATICALLY"
                }
            });
            await serviceSync.pullFromQueue();
        })
    })
})