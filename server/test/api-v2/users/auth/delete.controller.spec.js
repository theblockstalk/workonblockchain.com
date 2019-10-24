const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/mongoose/users');
const companyHepler = require('../companies/helpers');
const authenticateHepler = require('./authHelper');
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
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            let userDoc = await Users.findOne({email: company.email});

            const accountSetting = await authenticateHepler.destroyToken(userDoc.jwt_token);

            userDoc = await Users.findOne({email: company.email});
            should.equal(typeof userDoc.jwt_token, 'undefined');
        })
    })
})