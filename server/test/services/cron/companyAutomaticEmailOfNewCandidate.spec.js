const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const companies = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const docGenerator = require('../../helpers/docGenerator');
const companyHelper = require('../../api/users/company/companyHelpers');
const candidateHelper = require('../../api/users/candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('cron', function () {

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('send candidates to companies', function () {

        it('should send one candidate', async function () {

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const company = docGenerator.company();
            await companyHelper.signupVerifiedApprovedCompany(company);
        })

        it('should not send a candidate if they have already been sent')
    })
});