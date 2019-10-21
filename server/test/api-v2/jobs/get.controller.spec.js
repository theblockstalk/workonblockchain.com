const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companyHelper = require('../otherHelpers/companyHelpers');
const candidateHelper = require('../otherHelpers/candidateHelpers');
const users = require('../../../model/mongoose/users');

chai.use(chaiHttp);

describe('GET /jobs', function () {
    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
});

    describe('get job', function () {

        it('it should return a job', async function () {
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