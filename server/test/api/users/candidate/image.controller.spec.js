const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const candidateHelper = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('candidate profile image', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/image', () => {

        it('it should insert the candidate profile image', async () => {

            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHelper.signupCandidate(candidate);

            const candidateProfileImage = docGenerator.candidateProfileImage();
            const candidateProfile = await candidateHelper.candidateProfileImg(candidateProfileImage.image_name ,candidateRes.body.jwt_token);

            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const candidateDoc = await Candidates.findOne({_creator: userDoc._id}).lean();
            should.exist(candidateDoc);
            candidateDoc.image.should.equal(candidateProfileImage.image_name);

        })
    })
});