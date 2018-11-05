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

describe('update explanation pop for chat', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/updatePopupStatus', () => {

        it('it should update explanation pop for chat', async () => {

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const status = true;
            const result = await userHelpers.setStatus(status,userDoc.jwt_token);
            result.body.viewed_explanation_popup.should.equal(status);
        })
    })
});