const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../../helpers/mongo');
const Users = require('../../../../model/users');
const docGenerator = require('../../../helpers/docGenerator');
const companyHelper = require('../../users/company/companyHelpers');
const candidateHelper = require('../../users/candidate/candidateHelpers');
const adminHelper = require('./adminHelpers');
const userHelper = require('../../users/usersHelpers');
const settings = require('../../../../settings');
const docGeneratorV2 = require('../../../helpers/docGenerator-v2');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin get metrics', function () {

    afterEach(async () => {
    console.log('dropping database');
    await mongo.drop();
})

    describe('GET /users/get_metrics', () => {

        it('it should get the application metrics', async () => {

        const candidate = docGenerator.candidate();
        const profileData = docGeneratorV2.candidateProfile();

        await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
        await userHelper.approveCandidate(candidate.email);
        await userHelper.makeAdmin(candidate.email);

        const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();

        const metricsRes = await adminHelper.getMetrics(candidateUserDoc.jwt_token);
        const metrics = metricsRes.body;
        metrics.candidates.should.equal(1);
        metrics.emailVerified.should.equal(1);
        metrics.dissabled.should.equal(0);
        metrics.approvedEnabled.count.should.equal(1);

        const aggregrated = metrics.approvedEnabled.aggregated;
        console.log("blockchain");
        aggregrated.nationality[profileData.nationality].should.equal(1);
        should.not.exist(aggregrated.nationality.Australian);
        aggregrated.availabilityDay[profileData.availability_day].should.equal(1);
        aggregrated.baseCountry[profileData.base_country].should.equal(1);
        if(profileData.expected_salary_currency === '€ EUR')
        aggregrated.expectedSalaryUSD.min.should.equal(profileData.expected_salary*settings.CURRENCY_RATES_USD.Euro);
        aggregrated.interestAreas[profileData.interest_areas[0]].should.equal(1);
        aggregrated.locations[profileData.locations[1].country].count.should.equal(1);
        aggregrated.locations[profileData.locations[1].country].aggregate[profileData.locations[1].visa_needed].should.equal(1);
        aggregrated.roles[profileData.roles[0]].should.equal(1);
        aggregrated.programmingLanguages[profileData.programming_languages[0].language].count.should.equal(1);
        aggregrated.programmingLanguages[profileData.programming_languages[0].language].aggregate[profileData.programming_languages[0].exp_year].should.equal(1);
        aggregrated.programmingLanguages[profileData.programming_languages[1].language].count.should.equal(1);
        aggregrated.programmingLanguages[profileData.programming_languages[1].language].aggregate[profileData.programming_languages[1].exp_year].should.equal(1);
        aggregrated.blockchain.experimented[profileData.experimented_platforms[0]].should.equal(1);
        aggregrated.blockchain.experimented[profileData.experimented_platforms[1]].should.equal(1);
        should.not.exist(aggregrated.blockchain.experimented["EOOS"]);
    })
})
});