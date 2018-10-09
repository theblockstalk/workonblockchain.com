const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../../../users/company/companyHelpers');
const candidateHelper = require('../../../users/candidate/candidateHelpers');
const adminChatHelper = require('./adminChatHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get initial job offer msgs', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/get_job_desc_msgs', () => {

        it('it should get initial job offer msgs', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);
            const userDoc = await Users.findOne({email: candidate.email}).lean();

            const msgTag = 'job_offer';
            const messagesRes = await adminChatHelper.getInitialJobOfferDetail(companyDoc._id,userDoc._id,msgTag,companyDoc.jwt_token);
            const returnData = messagesRes.body;
            returnData.datas.should.equal(0);
        })
    })
});