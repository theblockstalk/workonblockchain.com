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

    describe('GET /statistics', function () {

        it('it should get the application metrics', async function () {

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
            console.log(profileData.nationality[0]);
            aggregrated.nationality[profileData.nationality[0]].should.equal(1);
            console.log(aggregrated);
            aggregrated.employmentAvailability[profileData.candidate.employee.employment_availability].should.equal(1);
            aggregrated.baseCountry[profileData.candidate.base_country].should.equal(1);
            if(profileData.candidate.employee.currency === '€ EUR')
            aggregrated.expectedSalaryUSD.min.should.equal(profileData.candidate.employee.expected_annual_salary*settings.CURRENCY_RATES_USD.Euro);
            aggregrated.interestAreas[profileData.candidate.interest_areas[0]].should.equal(1);
            aggregrated.employee.location[profileData.candidate.employee.location[1].country].count.should.equal(1);
            aggregrated.employee.location[profileData.candidate.employee.location[1].country].aggregate[profileData.candidate.employee.location[1].visa_needed].should.equal(1);
            aggregrated.employee.roles[profileData.candidate.employee.roles[0]].should.equal(1);
            aggregrated.commercial_skills[profileData.candidate.commercial_skills[0].name].count.should.equal(1);
            aggregrated.commercial_skills[profileData.candidate.commercial_skills[1].name].count.should.equal(1);
        });

        it('it should return statistics of active users', async function () {
            const candidate = docGenerator.candidate();
            await candidateHelper.signupVerifiedApprovedCandidate(candidate);

            const result = await statisticsHelpers.getStatistics();
            result.body.approvedEnabled.count.should.equal(1);
        })
    })
});