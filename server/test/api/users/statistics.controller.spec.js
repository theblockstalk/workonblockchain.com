const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const candidateHelper = require('./candidate/candidateHelpers');
const userHelpers = require('./usersHelpers');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('statistics count of user', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('POST /users/updatePopupStatus', () => {

        it('it should return statistics of active users', async () => {
        const candidate = docGenerator.candidate();
        await candidateHelper.signupVerifiedApprovedCandidate(candidate);

        const result = await userHelpers.getStatistics();
        result.body.approvedUsers.should.equal(1);

    })
})
});