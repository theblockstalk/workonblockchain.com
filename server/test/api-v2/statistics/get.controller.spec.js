const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const statisticsHelpers = require('./statisticsHelpers');
const candidateHelper = require('../../../test/api/users/candidate/candidateHelpers');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('statistics count of user', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /v2/statistics', () => {

        it('it should return statistics of active users', async () => {
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const result = await statisticsHelpers.getStatistics();
            result.body.approvedUsers.should.equal(1);
        })
    })
});