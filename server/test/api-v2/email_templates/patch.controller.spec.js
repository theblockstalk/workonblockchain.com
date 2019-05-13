const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const templateHelper = require('./templatesHelpers');
const emailTemplate = require('../../../model/mongoose/email_templates');
const users = require('../../../model/mongoose/users');

chai.use(chaiHttp);

describe('Patch /email_templates', function () {
    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
});

    describe('update email template doc', function () {

        it('it should update email template doc', async function () {
            const candidate = docGenerator.candidate();
            await candidateHelper.signupAdminCandidate(candidate);
            const userDoc = await users.findOneByEmail(candidate.email);

            const emailTemp = docGeneratorV2.newEmailTemplate();
            await templateHelper.newEmailTemplate(emailTemp, userDoc.jwt_token);

            const updateEmailTemp = docGeneratorV2.updateEmailTemplate();
            updateEmailTemp.name = emailTemp.name;
            await templateHelper.updateEmailTemplate(updateEmailTemp, userDoc.jwt_token);

            const emailTemplateDoc = await emailTemplate.findAll();
            emailTemplateDoc[0].name.should.equal(updateEmailTemp.name);
            emailTemplateDoc[0].body.should.equal(updateEmailTemp.body);
            emailTemplateDoc[0].subject.should.equal(updateEmailTemp.subject);

        })
    });
});