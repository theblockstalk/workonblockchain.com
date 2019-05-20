const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const Companies = require('../../../../../model/mongoose/company');
const docGenerator = require('../../../../helpers/docGenerator-v2');
const companyHelper = require('./../companyHelpers');
const userHelpers = require('../../../../api/users/usersHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('update company status', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('POST /users/:user_id/companies/status', () => {

        it('it should change company account status', async () => {

        const company = docGenerator.company();
        await companyHelper.signupCompany(company);
        await userHelpers.makeAdmin(company.email);
        const companyUserDoc = await Users.findOneByEmail(company.email);

        const updatedData = await docGenerator.companyUpdateProfile();
        const updateRes = await companyHelper.companyProfileData(companyUserDoc._creator, companyUserDoc.jwt_token , updatedData);

        //approve company
        const status = {is_approved : 1} ;
        const approveUser = await companyHelper.approveUser(companyUserDoc._id,status,companyUserDoc.jwt_token , true);
        const approvedCompanyDoc = await Users.findOne({_id: companyUserDoc._id});
        approvedCompanyDoc.is_approved.should.equal(status.is_approved);
        approveUser.body.success.should.equal(true);

    })
})
});