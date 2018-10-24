const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Chats = require('../../../model/chat');
const Users = require('../../../model/users');
const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../users/company/companyHelpers');
const candidateHelper = require('../users/candidate/candidateHelpers');
const chatHelper = require('./chatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get last job desc sent to a candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_last_job_desc_msg', () => {

        it('it should get last job desc sent to a candidate', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();
            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();

            //sending a message
            const initialJobOffer = docGenerator.initialJobOffer();
            const res = await chatHelper.insertMessage(companyDoc._id,candidateDoc._id,initialJobOffer,companyDoc.jwt_token);

            const jobDescRes = await chatHelper.getLastJobDescSent(companyDoc.jwt_token);
            const oldJobDesc = jobDescRes.body['datas'];
            oldJobDesc.description.should.equal(initialJobOffer.description);
            oldJobDesc.job_type.should.equal(initialJobOffer.job_type);
            oldJobDesc.job_title.should.equal(initialJobOffer.job_title);
            oldJobDesc.salary.should.equal(initialJobOffer.salary);
            oldJobDesc.salary_currency.should.equal(initialJobOffer.currency);
        })
    })
});