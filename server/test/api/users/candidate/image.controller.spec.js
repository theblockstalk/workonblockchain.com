const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const docGenerator = require('../../../helpers/docGenerator');
const imageInitialize = require('../../../helpers/imageInitialize');
const candidateHepler = require('./candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('upload profile image', function () {

    beforeEach(async () => {
        await imageInitialize.initialize();
    })

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/image', () => {

        it('it add an image to the candidate', async () => {

            const candidate = docGenerator.candidate();
            const signupRes = await candidateHepler.signupCandidate(candidate);

            const file = docGenerator.image();

            await candidateHepler.image(file, signupRes.body.jwt_token);

            const candidateDoc = await Candidates.findOne({_id: signupRes.body._id}).lean();
            assert(candidateDoc.image.includes(file.name));
        })
    })
});