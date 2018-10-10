const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const Candidates = require('../../../../../model/candidate_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHelper = require('../companyHelpers');
const candidateHelper = require('../../candidate/candidateHelpers');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('search candidates as company', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('POST /users/filter', () => {

        it('it should the candidate with filters', async () => {

            const company = docGenerator.company();
            const companyRes = await companyHelper.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const candidateRes = await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            let candidateData = await Candidates.findOne({_creator: candidateUserDoc._id}).lean();

            const params = {
                currency: candidateData.expected_salary_currency,
                salary: candidateData.expected_salary,
                position: candidateData.roles,
                skill: [],
                location: candidateData.locations,
                blockchain: [],
                availability: candidateData.availability_day,
            }

            const comapnyUserDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHelper.companyFilter(params , comapnyUserDoc.jwt_token);

            candidateData.expected_salary_currency.should.equal(params.currency);
            candidateData.expected_salary.should.equal(params.salary);
            candidateData.roles.should.valueOf(params.roles);
            candidateData.programming_languages[0].language.should.valueOf(params.skill);
            candidateData.locations.should.valueOf(params.location);
            candidateData.platforms[0].should.valueOf(params.blockchain);
            candidateData.availability_day.should.equal(params.availability);

        })
    })
});