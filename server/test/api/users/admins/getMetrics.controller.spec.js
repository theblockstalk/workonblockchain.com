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
            const profileData = docGenerator.profileData();
            const job = docGenerator.job();
            const resume = docGenerator.resume();
            const experience = docGenerator.experience();
            await candidateHelper.signupCandidateAndCompleteProfile(candidate, profileData,job,resume,experience );
            const candidateUserDoc = await Users.findOne({email: candidate.email}).lean();
            const company = docGenerator.company();
            const companyTnCWizard = docGenerator.companyTnCWizard();
            const companyAbout = docGenerator.companyAbout();
            await companyHelper.signupCompanyAndCompleteProfile(company,companyTnCWizard,companyAbout);
            await userHelper.makeAdmin(company.email);
            const companyUserDoc = await Users.findOne({email: company.email}).lean();

            const metricsRes = await adminHelper.getMetrics(companyUserDoc.jwt_token);
            const metrics = metricsRes.body;
            metrics.candidates.should.equal(1);
            metrics.emailVerified.should.equal(1);
            metrics.dissabled.should.equal(0);
            metrics.approvedEnabled.count.should.equal(1);

            const aggregrated = metrics.approvedEnabled.aggregated;
            console.log("blockchain");
            aggregrated.nationality[profileData.nationality].should.equal(1);
            should.not.exist(aggregrated.nationality.Australian);
            aggregrated.availabilityDay[job.availability_day].should.equal(1);
            aggregrated.baseCountry[profileData.country].should.equal(1);
            aggregrated.expectedSalaryUSD.min.should.equal(job.expected_salary*settings.CURRENCY_RATES_USD.Euro);
            aggregrated.interestAreas[job.interest_areas[0]].should.equal(1);
            aggregrated.locations[job.country[0].country].count.should.equal(1);
            aggregrated.locations[job.country[0].country].aggregate[job.country[0].visa_needed].should.equal(1);
            aggregrated.roles[job.roles[0]].should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[0].language].count.should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[0].language].aggregate[experience.language_exp[0].exp_year].should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[1].language].count.should.equal(1);
            aggregrated.programmingLanguages[experience.language_exp[1].language].aggregate[experience.language_exp[1].exp_year].should.equal(1);
            aggregrated.blockchain.experimented[resume.experimented_platforms[0]].should.equal(1);
            aggregrated.blockchain.experimented[resume.experimented_platforms[1]].should.equal(1);
            should.not.exist(aggregrated.blockchain.experimented["EOS"]);
        })
    })
});