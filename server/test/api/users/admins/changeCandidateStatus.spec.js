const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');

chai.use(chaiHttp);

describe('admin changes status of a candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/approve_candidate', () => {

        it('it should changes status of a candidate', async () => {

            //creating a company
            const company = docGenerator.company();
            await companyHelper.signupAdminCompany(company);
            const companyDoc = await Users.findOne({email: company.email}).lean();

            //creating a candidate
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerfiedCandidate(candidate);
            const candidateDoc = await Users.findOne({email: candidate.email}).lean();

            //approve candidate
            const status = 'approved';
            const reason = '';
            const approveUser = await adminHelper.changeCandidateStatus(candidateDoc._id,status,reason,companyDoc.jwt_token);
            const approvedCandidateDoc = await Users.findOne({_id: candidateDoc._id}).lean();
            approvedCandidateDoc.candidate.status[0].status.should.equal(status);
        })
    })
});