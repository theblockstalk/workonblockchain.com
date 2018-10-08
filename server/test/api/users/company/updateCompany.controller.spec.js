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

describe('update profile as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/update_company_profile', () => {

        it('it should update company profile', async () => {

            const company = docGenerator.company();
            const res = await companyHepler.signupCompany(company);


        })
    })
});