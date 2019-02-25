const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const docGenerator = require('../../../../helpers/docGenerator');
const candidateHelper = require('../candidateHelpers');
const candidateWizardHelper = require('./candidateWizardHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('add initial info of candidate', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('PUT /users/welcome/about', () => {

        it('it should add initial info of candidate', async () => {

            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            let userDoc = await Users.findOne({email: candidate.email}).lean();
            const candidateProfileInfo = docGenerator.profileData();

            const res = await candidateWizardHelper.about(candidateProfileInfo,userDoc.jwt_token);
            res.body.success.should.equal(true);
            userDoc = await Users.findOne({email: candidate.email}).lean();

            userDoc.first_name.should.equal(candidateProfileInfo.first_name);
            userDoc.last_name.should.equal(candidateProfileInfo.last_name);
            userDoc.candidate.github_account.should.equal(candidateProfileInfo.github_account);
            userDoc.candidate.stackexchange_account.should.equal(candidateProfileInfo.exchange_account);
            userDoc.candidate.linkedin_account.should.equal(candidateProfileInfo.linkedin_account);
            userDoc.candidate.medium_account.should.equal(candidateProfileInfo.medium_account);
            userDoc.contact_number.should.equal(candidateProfileInfo.contact_number);
            userDoc.nationality.should.equal(candidateProfileInfo.nationality);
            userDoc.candidate.base_city.should.equal(candidateProfileInfo.city);
            userDoc.candidate.base_country.should.equal(candidateProfileInfo.country);
        })
    })
});