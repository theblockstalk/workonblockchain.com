const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');
const server = require('../../../../../../server');
const mongo = require('../../../../helpers/mongo');
const Users = require('../../../../../model/users');
const Companies = require('../../../../../model/employer_profile');
const Candidates = require('../../../../../model/candidate_profile');
const docGenerator = require('../../../../helpers/docGenerator');
const companyHepler = require('../companyHelpers');
const candidateHepler = require('../../candidate/candidateHelpers');

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
            const companyRes = await companyHepler.signupVerifiedApprovedCompany(company);

            const candidate = docGenerator.candidate();
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();

            const candidateRes = await candidateHepler.signupAndCompleteProfile(candidate, profileData,job,resume,experience );

            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            let candidateData = await Candidates.findOne({_creator: candidateUserDoc._id}).lean();

            const params = {
                currency: candidateData.expected_salary_currency,
                salary: candidateData.expected_salary,
                position: candidateData.roles,
                skill: ['Java' , 'C#'],
                location: candidateData.locations,
                blockchain: ['Bitcoin'],
                availability: candidateData.availability_day,
            }

            const companyFilterData = params

            const userDoc = await Users.findOne({email: company.email}).lean();
            const filterRes = await companyHepler.companyFilter(companyFilterData , userDoc.jwt_token);

            const foundCandidate  = filterRes.body[0].ids[0];

            candidateData = await Candidates.findOne({_creator: foundCandidate}).lean();

            candidateData.expected_salary_currency.should.equal(companyFilterData.currency);
            candidateData.expected_salary.should.equal(companyFilterData.salary);
            candidateData.roles.should.valueOf(companyFilterData.roles);
            //will look after the linkedin FE integration
            //candidateData.programming_languages.language.should.valueOf(companyFilterData.skill);
            candidateData.locations.should.valueOf(companyFilterData.location);
            //candidateData.platforms.platform_name.should.valueOf(companyFilterData.blockchain);
            candidateData.availability_day.should.equal(companyFilterData.availability);

        })
    })
});