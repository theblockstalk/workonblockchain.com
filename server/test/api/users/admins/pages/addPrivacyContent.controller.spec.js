const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../../../users/company/companyHelpers');
const candidateHelper = require('../../../users/candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('CMS page data as admin ', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/add_privacy_content', () => {

        it('it should insert html data in db', async () => {

            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();


        })
    })
});