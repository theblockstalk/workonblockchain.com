const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../server');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const adminHelper = require('../users/admins/adminHelpers');
const companyHelper = require('../users/company/companyHelpers');
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

    describe('GET /users/get_pages_content/:title', () => {

        it('it should get page content', async () => {

            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            const info = docGenerator.cmsContent();
            const cmsRes = await adminHelper.addCmsContent(info , companyDoc.jwt_token);

            const getContent = await pageHelper.getPageContent(info.page_name,companyDoc.jwt_token);
            const res = getContent.body[0];

            res.page_name.should.equal(info.page_name);
            res.page_title.should.equal(info.page_title);
            res.page_content.should.equal(info.html_text);

        })
    })
});