const chai = require('chai');
const chaiHttp = require('chai-http');
const date = require('date-and-time');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin approve a candidate/company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/approve', () => {

        it('it should admin approve a candidate/company', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerfiedCandidate(candidate);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();

            //approve candidate
            const status = 1;
            await adminHelper.approveUser(candidateDoc._id,status,companyDoc.jwt_token);
            const approvedCandidateDoc = await Users.findOne({_id: candidateDoc._id}).lean();
            approvedCandidateDoc.is_approved.should.equal(status);
        })
    })
});