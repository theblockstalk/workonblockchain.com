const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../otherHelpers/companyHelpers');
const candidateHelper = require('../otherHelpers/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const templateHelper = require('./templatesHelpers');
const emailTemplate = require('../../../model/mongoose/email_templates');
const users = require('../../../model/mongoose/users');

chai.use(chaiHttp);

describe('Get /email_templates', function () {
    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
});

    describe('get email template doc', function () {

        it('it should return email template doc', async function () {
            const candidate = docGenerator.candidate();
            await candidateHelper.signupAdminCandidate(candidate);
            const userDoc = await users.findOneByEmail(candidate.email);
            const emailTemp = docGeneratorV2.newEmailTemplate();
            await templateHelper.newEmailTemplate(emailTemp, userDoc.jwt_token);

            const emailTemplateDoc = await templateHelper.getEmailTemplate(userDoc.jwt_token);
            console.log(emailTemplateDoc);
            emailTemplateDoc.body[0].name.should.equal(emailTemp.name);
            emailTemplateDoc.body[0].body.should.equal(emailTemp.body);
            emailTemplateDoc.body[0].subject.should.equal(emailTemp.subject);

        })
    });
});