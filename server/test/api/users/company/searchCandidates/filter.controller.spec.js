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
            const candidateRes = await candidateHepler.signupVerifiedApprovedCandidate(candidate);

            const userDoc = await Users.findOne({email: company.email}).lean();
            const companyFilterData = docGenerator.companyFilterData();

            const filterRes = await companyHepler.companyFilter(companyFilterData , userDoc.jwt_token);

            const foundCandidate = filterRes.body[0];

            foundCandidate.expected_salary_currency.should.equal(companyFilterData.currency);
            foundCandidate.expected_salary.should.equal(companyFilterData.salary);
            foundCandidate.roles.should.equal(companyFilterData.roles);
            foundCandidate.programming_languages.language.should.equal(companyFilterData.skill);
            foundCandidate.locations.should.equal(companyFilterData.location);
            foundCandidate.commercial_platform.platform_name.should.equal(companyFilterData.blockchain);
            foundCandidate.platforms.platform_name.should.equal(companyFilterData.blockchain);
            foundCandidate.availability_day.should.equal(companyFilterData.availability);
            foundCandidate.why_work.should.equal(companyFilterData.word);
            foundCandidate.description.should.equal(companyFilterData.word);

        })
    })
});