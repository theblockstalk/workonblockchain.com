const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const candidateHepler = require('../../../otherHelpers/candidateHelpers');
const authenticateHepler = require('../authHelper');
const docGenerator = require('../../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);


describe('change password of candidate or company' , function() {

    afterEach(async()=>{
        console.log("dropping database");
        await mongo.drop();
    })

    describe('PUT /users/change_password' , () => {

        it('it should change password of candidate' , async() => {

            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email});
            const changePassword = docGenerator.changePassword();
            const newPassword = await authenticateHepler.changeUserPassword(changePassword, userDoc.jwt_token);

            const userDocNew = await Users.findOne({email: candidate.email});
            const salt = userDocNew.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(changePassword.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDocNew.password_hash.should.equal(hashedPasswordAndSalt);

        })


    })

});