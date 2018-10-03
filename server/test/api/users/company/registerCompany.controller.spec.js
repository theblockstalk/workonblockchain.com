const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const companyHepler = require('../../../helpers/companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('signup as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        //await mongo.drop();
    })

    describe('POST /users/create_employer', () => {

        it('it should signup a new company', async () => {

            const company = docGenerator.company();
            const data = await companyHepler.signupcompany(company);
            data.should.have.status(200);

            const userDoc = await Users.findOne({email: company.email}).lean();
            userDoc.email.should.equal(company.email);
            userDoc.is_verify.should.equal(1);
            userDoc.is_approved.should.equal(0);
            userDoc.is_admin.should.equal(0);
            userDoc.disable_account.should.equal(false);
            userDoc.type.should.equal("company");
            should.exist(userDoc.jwt_token)

            const salt = userDoc.salt;
            let hash = crypto.createHmac('sha512', salt);
            hash.update(company.password);
            const hashedPasswordAndSalt = hash.digest('hex');
            userDoc.password_hash.should.equal(hashedPasswordAndSalt);

            const companyDoc = await Companies.findOne({_creator: userDoc._id}).lean();
            should.exist(companyDoc);
            companyDoc.marketing_emails.should.equal(false);
        })
    })
});