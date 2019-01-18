const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const Companies = require('../../../../model/employer_profile');
const docGenerator = require('../../../helpers/docGenerator');
const imageInitialize = require('../../../helpers/imageInitialize');
const companyHepler = require('./companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('upload company profile image', function () {

    beforeEach(async () => {
        await imageInitialize.initialize();
    })

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/employer_image', () => {

        it('it add an image to the company', async () => {

            const company = docGenerator.company();
            const signupRes = await companyHepler.signupCompany(company);
            console.log(signupRes.body);
            const file = docGenerator.image();

            await companyHepler.image(file, signupRes.body.jwt_token);

            const companyDoc = await Companies.findOne({_id: signupRes.body._id}).lean();
            console.log(companyDoc);
            assert(companyDoc.company_logo.includes(file.name));
        })
    })
});