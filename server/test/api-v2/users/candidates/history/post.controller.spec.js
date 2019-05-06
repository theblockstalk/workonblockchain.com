const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator-v2');
const candidateHelper = require('../candidateHelpers');
const userHelper = require('../../../../api/users/usersHelpers');
const companyHelper = require('../../companies/companyHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin changes status of a candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
    await mongo.drop();
})

    describe('POST /users/user_id/candidates/status', () => {

        it('it should changes status of a candidate', async () => {

        //creating a company
        const company = docGenerator.company();
        await companyHelper.signupCompany(company);
        const companyDoc = await users.findOne({email: company.email}).lean();
        await userHelper.makeAdmin(companyDoc.email);

        //creating a candidate
        const candidate = docGenerator.candidate();
        const profileData = docGenerator.candidateProfile();
        await candidateHelper.candidateProfile(candidate, profileData);
        await userHelper.makeAdmin(candidate.email);
        const candidateDoc = await users.findOne({email: candidate.email}).lean();

        //approve candidate
        const inputQuery = docGenerator.changeCandidateStatus();
        const approveUser = await candidateHelper.changeCandidateStatus(candidateDoc._id, inputQuery,companyDoc.jwt_token);
        const candidateUserDoc = approveUser.body;

        candidateUserDoc.candidate.history[0].status.status.should.equal(inputQuery.status);
        candidateUserDoc.candidate.history[0].note.should.equal(inputQuery.note);
        candidateUserDoc.candidate.history[0].email_html.should.equal(inputQuery.email_html);
        candidateUserDoc.candidate.history[0].email_subject.should.equal(inputQuery.email_subject);
        candidateUserDoc.candidate.latest_status.status.should.equal(inputQuery.status);

    })
})
});