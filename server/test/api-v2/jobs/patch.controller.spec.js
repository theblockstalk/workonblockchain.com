const mongo = require('../../helpers/mongo');
const api = require('../api');

const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/companies');

const docGenerator = require('../../helpers/docGenerator-v2');
const companyHelper = require('../otherHelpers/companyHelpers');
const jobHelpers = require('./helpers');
const userHelpers = require('../otherHelpers/usersHelpers');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('POST /jobs', function () {
    let jobPost, jobPatch;

    beforeEach(async function () {
        jobPost = await jobHelpers.jobPost();

        const randomJob2 = await jobHelpers.jobPost();
        jobPatch = {
            name: randomJob2.name,
            status: "closed",
            work_type: "contractor",
            locations:  [{
                remote: true
            }, {
                city_id: randomJob2.locations[0].city_id,
                city: randomJob2.locations[0].city,
                country: randomJob2.locations[0].country
            }],
            visa_needed: true,
            job_type: ["Part time"],
            positions:  ['UI Developer', 'UX Designer'],
            expected_salary_min: 50000,
            expected_salary_max: 100000,
            num_people_desired: 2,
            required_skills: [{
                skills_id: randomJob2.required_skills[0].skills_id,
                type: randomJob2.required_skills[0].type,
                name: randomJob2.required_skills[0].name,
                exp_year: randomJob2.required_skills[0].exp_year
            }],
            not_required_skills: [{
                skills_id: randomJob2.not_required_skills[0].skills_id,
                type: randomJob2.not_required_skills[0].type,
                name: randomJob2.not_required_skills[0].name
            }],
            description: randomJob2.description,
        };
    })

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })

    describe('positive tests', function () {

        it('it should patch a job as company', async function () {
            const company = docGenerator.company();
            await companyHelper.signupCompany(company);
            const companyUserDoc = await users.findOne({email: company.email});

            let res = await api.jobs.POST(companyUserDoc.jwt_token, null, jobPost);
            let job = res.body;

            const query = {
                job_id: job._id
            };
            res = await api.jobs.PATCH(companyUserDoc.jwt_token, query, jobPatch)
            res.status.should.equal(200);

            job = res.body;
            job.name.should.equal(jobPatch.name);
            job.status.should.equal(jobPatch.status);
            job.work_type.should.equal(jobPatch.work_type);
            job.locations[1].city.should.equal(jobPatch.locations[1].city);
            job.locations[0].remote.should.equal(jobPatch.locations[0].remote);
            job.visa_needed.should.equal(jobPatch.visa_needed);
            job.job_type[0].should.equal(jobPatch.job_type[0]);
            job.positions[0].should.equal(jobPatch.positions[0]);
            job.positions[1].should.equal(jobPatch.positions[1]);
            job.expected_salary_min.should.equal(jobPatch.expected_salary_min);
            job.expected_salary_max.should.equal(jobPatch.expected_salary_max);
            job.required_skills[0].name.should.equal(jobPatch.required_skills[0].name);
            job.not_required_skills[0].skills_id.toString().should.equal(jobPatch.not_required_skills[0].skills_id.toString());
            job.num_people_desired.should.equal(jobPatch.num_people_desired);

            const jobUnpatch = {
                unset_visa_needed: true,
                unset_job_type: true,
                unset_expected_salary_min: true,
                unset_expected_salary_max: true,
                unset_required_skills: true,
                unset_not_required_skills: true
            };
            res = await api.jobs.PATCH(companyUserDoc.jwt_token, query, jobUnpatch);
            res.status.should.equal(200);

            job = res.body;
            expect(job.visa_needed).to.not.exist;
            expect(job.job_type).to.not.exist;
            expect(job.expected_salary_min).to.not.exist;
            expect(job.expected_salary_max).to.not.exist;
            expect(job.required_skills).to.not.exist;
            expect(job.not_required_skills).to.not.exist;
        })

        it('it should patch a job as an admin', async function () {
            const company = docGenerator.company();
            await companyHelper.signupCompany(company);
            const companyUserDoc = await users.findOne({email: company.email});
            let companyDoc = await companies.findOne({_creator: companyUserDoc._id});

            let res = await api.jobs.POST(companyUserDoc.jwt_token, null, jobPost);
            let job = res.body;

            const query = {
                job_id: job._id,
                admin: true,
                company_id: companyDoc._id
            };

            const company2 = docGenerator.company();
            await companyHelper.signupCompany(company2);
            const companyUserDoc2 = await users.findOne({email: company2.email});
            await userHelpers.makeAdmin(company2.email);

            res = await api.jobs.PATCH(companyUserDoc2.jwt_token, query, jobPatch)
            res.status.should.equal(200);

            job = res.body;
            job.name.should.equal(jobPatch.name);
        })
    });
});