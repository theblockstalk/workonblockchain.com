const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

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
            const candidateRes = await candidateHepler.signupCandidate(candidate);

            const changePassword = docGenerator.changePassword();
            const newPassword = await authenticateHepler.changeUserPassword(changePassword, candidateRes.body.jwt_token);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(changePassword.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDoc.password_hash.should.equal(hashedPasswordAndSalt);

        })


    })

});