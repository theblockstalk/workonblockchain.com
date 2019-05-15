const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const messagesHelpers = require('../../helpers');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../../api/users/company/companyHelpers');
const candidateHelper = require('../../../api/users/candidate/candidateHelpers');
const docGeneratorV2 = require('../../../helpers/docGenerator-v2');
const users = require('../../../../model/mongoose/users');

chai.use(chaiHttp);

describe('GET /conversations/:sender_id/messages/', function () {
    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    });

    describe('getting messages of a company or candidate', function () {

        it('it should get messages of a company or candidate', async function () {
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyUserDoc = await users.findOneByEmail(company.email);

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateuserDoc = await users.findOneByEmail(candidate.email);

            const approachOffer = docGeneratorV2.messages.approach(candidateuserDoc._id);
            await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

            const res = await messagesHelpers.getmessages(candidateuserDoc._id,companyUserDoc.jwt_token);
            const messages =  res.body.messages[0];
            messages.msg_tag.should.equal(approachOffer.msg_tag);
            messages.message.approach.employee.job_title.should.equal(approachOffer.message.approach.employee.job_title);
            messages.message.approach.employee.annual_salary.should.equal(approachOffer.message.approach.employee.annual_salary);
            messages.message.approach.employee.currency.should.equal(approachOffer.message.approach.employee.currency);
            messages.message.approach.employee.employment_type.should.equal(approachOffer.message.approach.employee.employment_type);
            messages.message.approach.employee.location.should.equal(approachOffer.message.approach.employee.location);
            messages.message.approach.employee.employment_description.should.equal(approachOffer.message.approach.employee.employment_description);
        })
    });
});