const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Candidates = require('../../../../model/candidate_profile');
const Companies = require('../../../../model/employer_profile');
const companyHepler = require('../company/companyHelpers');
const candidateHepler = require('../candidate/candidateHelpers');
const authenticateHepler = require('./authenticateHelpers');
const docGenerator = require('../../../helpers/docGenerator');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('destroy token' , function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/destroy_token' , () => {

        it('it should destroy token on logout' , async() => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            let userDoc = await Users.findOne({email: company.email}).lean();

            const accountSetting = await authenticateHepler.destroyToken(userDoc.jwt_token);

            userDoc = await Users.findOne({email: company.email}).lean();
            userDoc.jwt_token.should.equal(null);
        })
    })
})