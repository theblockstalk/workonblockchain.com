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

            const jobOffer = docGeneratorV2.messages.job_offer(candidateuserDoc._id);
            await messagesHelpers.post(jobOffer, companyUserDoc.jwt_token);

            const res = await messagesHelpers.getmessages(candidateuserDoc._id,companyUserDoc.jwt_token);
            const messages =  res.body.messages[0];
            res.body.jobOffer.should.equal('sent')
            messages.msg_tag.should.equal(jobOffer.msg_tag);
            messages.message.job_offer.title.should.equal(jobOffer.message.job_offer.title);
            messages.message.job_offer.salary.should.equal(jobOffer.message.job_offer.salary);
            messages.message.job_offer.salary_currency.should.equal(jobOffer.message.job_offer.salary_currency);
            messages.message.job_offer.type.should.equal(jobOffer.message.job_offer.type);
            messages.message.job_offer.location.should.equal(jobOffer.message.job_offer.location);
            messages.message.job_offer.description.should.equal(jobOffer.message.job_offer.description);
        })
    });
});