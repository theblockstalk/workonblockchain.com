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

describe('upload profile image', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/image', () => {

        it('it add an image to the candidate', async () => {

            const company = docGenerator.company();
            const signupRes = await companyHepler.signupCompany(company);

            const file = docGenerator.image();

            await companyHepler.image(file, signupRes.body.jwt_token);

            const companyDoc = await Companies.findOne({_id: signupRes.body._id}).lean();
            assert(companyDoc.company_logo.includes(file.name));
        })
    })
});