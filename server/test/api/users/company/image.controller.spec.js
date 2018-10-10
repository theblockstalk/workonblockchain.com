const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const companyHepler = require('./companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('company profile image', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/employer_image', () => {

        it('it should insert the company profile image', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupCompany(company);

            const companyProfileImage = docGenerator.companyProfileImage();
            const companyProfile = await companyHepler.companyProfileImg(companyProfileImage.image_name ,companyRes.body.jwt_token);

            const userDoc = await Users.findOne({email: company.email}).lean();

            const companyDoc = await Companies.findOne({_creator: userDoc._id}).lean();
            should.exist(companyDoc);
            companyDoc.company_logo.should.equal(companyProfileImage.image_name);

        })
    })
});