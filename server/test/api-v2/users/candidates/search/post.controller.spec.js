const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/mongoose/users');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../../../../../../server/test/api/users/candidate/candidateHelpers');
const candidateHelpers = require('../candidateHelpers');
const userHelpers = require('../../../../../../server/test/api/users/usersHelpers');
const docGeneratorV2 = require('../../../../helpers/docGenerator-v2');
const messagesHelpers = require('../../../../../test/api-v2/helpers');
const companiesHelperV2 = require('../../../../api-v2/users/companies/companyHelpers');
const candidateHelperV2 = require('../../../../api-v2/users/candidates/candidateHelpers');
const messages = require('../../../../../model/mongoose/messages');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('get all users', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /v2/users/candidates/search?is_admin', () => {

        it('it should get all users', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );
            await userHelpers.makeAdmin(candidate.email);

            let userDoc = await Users.findOne({email: candidate.email});

            const isAdmin = true;
            const getAllCandidates = await candidateHelpers.getAll(isAdmin,userDoc.jwt_token);
            userDoc = await Users.findOne({email: candidate.email});

            getAllCandidates.body[0].email.should.equal(userDoc.email);
            getAllCandidates.body[0].first_name.should.equal(userDoc.first_name);
            getAllCandidates.body[0].last_name.should.equal(userDoc.last_name);
        })
    });

    describe('POST /v2/users/candidates/search', () => {

        it('it should search candidate by filter', async () => {
            const company = docGeneratorV2.company();
            await companiesHelperV2.signupCompany(company);
            const companyDoc = await Users.findOneByEmail(company.email);

            const updatedData = await docGeneratorV2.companyUpdateProfile();
            const updateRes = await companiesHelperV2.companyProfileData(companyDoc._creator, companyDoc.jwt_token , updatedData);
            await userHelpers.verifyEmail(company.email);
            await userHelpers.approve(company.email);

            await userHelpers.makeAdmin(company.email);
            const companyUserDoc = await Users.findOneByEmail(company.email);

            const profileData = docGeneratorV2.candidateProfile();
            const candidate = docGenerator.candidate();

            const candidateRes = await candidateHelperV2.candidateProfile(candidate,profileData);
            await userHelpers.makeAdmin(candidate.email);
            await userHelpers.approveCandidate(candidate.email);
            const candidateUserDoc = await Users.findOneByEmail(candidate.email);

            const approachOffer = docGeneratorV2.messages.approach(candidateUserDoc._id);
            const res = await messagesHelpers.post(approachOffer, companyUserDoc.jwt_token);

            const messageDoc = await messages.findOne({sender_id: companyUserDoc._id,receiver_id: candidateUserDoc._id});
            console.log(messageDoc);
            const data = {
                msg_tags : [messageDoc.msg_tag],
                is_approve : candidateUserDoc.candidate.history[0].status.status,
                word : candidate.first_name
            }
            const isAdmin = true;
            const candidateFilterRes = await candidateHelpers.candidateFilter(isAdmin,data , candidateUserDoc.jwt_token);
            candidateFilterRes.body[0].first_name.should.equal(candidate.first_name);
            candidateUserDoc.candidate.history[0].status.status.should.equal('approved');
            messageDoc.msg_tag.should.valueOf(data.msg_tags);

        })
    })
});