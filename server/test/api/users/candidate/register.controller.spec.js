const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHepler = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('signup as candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/register', () => {

        it('it should signup a new candidate', async () => {

            const candidate = docGenerator.candidate();

            const res = await candidateHepler.signupCandidate(candidate);

            res.should.have.status(200);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            userDoc.email.should.equal(candidate.email);
            userDoc.is_verify.should.equal(0);
            userDoc.is_approved.should.equal(0);
            userDoc.is_admin.should.equal(0);
            userDoc.disable_account.should.equal(false);
            userDoc.type.should.equal("candidate");
            should.exist(userDoc.jwt_token)

            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(candidate.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDoc.password_hash.should.equal(hashedPasswordAndSalt);

            const candidateDoc = await Candidates.findOne({_creator: userDoc._id}).lean();
            should.exist(candidateDoc);
            candidateDoc.marketing_emails.should.equal(false);
        })
    })
});