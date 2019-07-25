const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const messagesHelpers = require('../helpers');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../otherHelpers/companyHelpers');
const candidateHelper = require('../otherHelpers/candidateHelpers');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');
const users = require('../../../model/mongoose/users');

chai.use(chaiHttp);

describe('GET /messages', function () {
    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    });

    describe('getting messages', function () {

        it('it should get messages', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const approachOffer = docGeneratorV2.messages.approach(candidateuserDoc._id);
            await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

            const res = await messagesHelpers.get(companyUserDoc.jwt_token);
            const messageDoc = res.body;
            messageDoc.msg_tag.should.equal(approachOffer.msg_tag);
            messageDoc.message.approach.employee.job_title.should.equal(approachOffer.message.approach.employee.job_title);
            messageDoc.message.approach.employee.annual_salary.should.equal(approachOffer.message.approach.employee.annual_salary);
            messageDoc.message.approach.employee.currency.should.equal(approachOffer.message.approach.employee.currency);
            messageDoc.message.approach.employee.employment_type.should.equal(approachOffer.message.approach.employee.employment_type);
            messageDoc.message.approach.employee.location.should.equal(approachOffer.message.approach.employee.location);
            messageDoc.message.approach.employee.employment_description.should.equal(approachOffer.message.approach.employee.employment_description);
        })
    });
});