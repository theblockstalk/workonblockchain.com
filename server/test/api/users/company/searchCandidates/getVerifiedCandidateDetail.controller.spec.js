const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHepler = require('../companyHelpers');
const candidateHepler = require('../../candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get verified candidate detail as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/candidate_detail', () => {

        it('it should return verified candidate detail of first chat offer unaccepted', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const companyReply =0 ;
            const filterRes = await companyHepler.getVerifiedCandidateDetail(userDoc._id , companyReply, companyUserDoc.jwt_token);

            let res = filterRes.body._creator;
            res.is_verify.should.equal(1);
            res.is_approved.should.equal(1);
            res.disable_account.should.equal(false);
            res.type.should.equal("candidate");
            let name = candidate.first_name[0].toUpperCase() + candidate.last_name[0].toUpperCase();
            console.log(name);
            res.initials.should.equal(name);

        })

        it('it should return verified candidate detail of first chat offer accepted', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const candidateRes = await candidateHepler.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: candidate.email}).lean();
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const companyReply =1 ;
            const filterRes = await companyHepler.getVerifiedCandidateDetail(userDoc._id , companyReply, companyUserDoc.jwt_token);

            let res = filterRes.body._creator;
            res.is_verify.should.equal(1);
            res.is_approved.should.equal(1);
            res.disable_account.should.equal(false);
            res.type.should.equal("candidate");
            res.first_name.should.equal(candidate.first_name);
            res.last_name.should.equal(candidate.last_name);

        })
    })
});