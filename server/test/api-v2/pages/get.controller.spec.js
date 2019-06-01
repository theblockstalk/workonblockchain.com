const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/mongoose/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../otherHelpers/companyHelpers');
const pageHelper = require('./pagesHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get page content', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /v2/pages', () => {

        it('it should get page content', async () => {

            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email});

            const info = docGenerator.cmsContent();
            const cmsRes = await pageHelper.addPages(info , companyDoc.jwt_token);

            const getContent = await pageHelper.getPage(info.name,companyDoc.jwt_token);
            const res = getContent.body;

            res.page_name.should.equal(info.name);
            res.page_title.should.equal(info.title);
            res.page_content.should.equal(info.content);

        })
    })
});