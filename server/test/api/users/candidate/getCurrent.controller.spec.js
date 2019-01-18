const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get current candidate info', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /users/current', () => {

        it('it should get current candidate info', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateInfo = await candidateHelper.getCurrentCandidateInfo(userDoc._id,userDoc.jwt_token);
            const res = candidateInfo.body;
            res.email.should.equal(candidate.email);
            res.type.should.equal(candidate.type);
        })
    })
});