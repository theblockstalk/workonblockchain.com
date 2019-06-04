const chai = require('chai');
const chaiHttp = require('chai-http');
const mongo = require('../../helpers/mongo');
const Users = require('../../../model/mongoose/users');
const docGenerator = require('../../helpers/docGenerator');
const candidateHelper = require('../otherHelpers/candidateHelpers');
const statisticsHelpers = require('./statisticsHelpers');
const userHelper = require('../otherHelpers/usersHelpers');
const settings = require('../../../settings');
const docGeneratorV2 = require('../../helpers/docGenerator-v2');

const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);

describe('admin get metrics', function () {

    afterEach(async () => {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('GET /statistics', () => {

        it('it should get the application metrics', async () => {

            const candidate = docGenerator.candidate();
            const profileData = docGeneratorV2.candidateProfile();

            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData );
            await userHelper.approveCandidate(candidate.email);
            await userHelper.makeAdmin(candidate.email);

            const candidateUserDoc = await Users.findOne({email: candidate.email});

            const admin = true;
            const metricsRes = await statisticsHelpers.getMetrics(admin,candidateUserDoc.jwt_token);
            const metrics = metricsRes.body;
            metrics.candidates.should.equal(1);
            metrics.emailVerified.should.equal(1);
            metrics.dissabled.should.equal(0);
            metrics.approvedEnabled.count.should.equal(1);

            const aggregrated = metrics.approvedEnabled.aggregated;
            console.log("blockchain");
            console.log(aggregrated.nationality);
            console.log(profileData.nationality[0])
            aggregrated.nationality[profileData.nationality[0]].should.equal(1);
            console.log(aggregrated)
            aggregrated.employmentAvailability[profileData.employee.employment_availability].should.equal(1);
            aggregrated.baseCountry[profileData.base_country].should.equal(1);
            if(profileData.employee.currency === '€ EUR')
            aggregrated.expectedSalaryUSD.min.should.equal(profileData.employee.expected_annual_salary*settings.CURRENCY_RATES_USD.Euro);
            aggregrated.interestAreas[profileData.interest_areas[0]].should.equal(1);
            aggregrated.employee.location[profileData.employee.location[1].country].count.should.equal(1);
            aggregrated.employee.location[profileData.employee.location[1].country].aggregate[profileData.employee.location[1].visa_needed].should.equal(1);
            aggregrated.employee.roles[profileData.employee.roles[0]].should.equal(1);
            aggregrated.programmingLanguages[profileData.programming_languages[0].language].count.should.equal(1);
            aggregrated.programmingLanguages[profileData.programming_languages[0].language].aggregate[profileData.programming_languages[0].exp_year].should.equal(1);
            aggregrated.programmingLanguages[profileData.programming_languages[1].language].count.should.equal(1);
            aggregrated.programmingLanguages[profileData.programming_languages[1].language].aggregate[profileData.programming_languages[1].exp_year].should.equal(1);
            aggregrated.blockchain.experimented_platforms[profileData.experimented_platforms[0]].should.equal(1);
            aggregrated.blockchain.experimented_platforms[profileData.experimented_platforms[1]].should.equal(1);
            should.not.exist(aggregrated.blockchain.experimented_platforms["EOOS"]);
        });

        it('it should return statistics of active users', async () => {
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const result = await statisticsHelpers.getStatistics();
            result.body.approvedUsers.should.equal(1);
        })
    })
});