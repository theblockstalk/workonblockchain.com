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
    let jobPost;

    beforeEach(async function () {
        jobPost = await jobHelpers.jobPost();
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
            res = await api.jobs.GET(companyUserDoc.jwt_token, query)
            res.status.should.equal(200);

            job = res.body;
            job.name.should.equal(jobPost.name);
            job.status.should.equal(jobPost.status);
            job.work_type.should.equal(jobPost.work_type);
            job.locations[0].city.should.equal(jobPost.locations[0].city);
            job.locations[1].remote.should.equal(jobPost.locations[1].remote);
            job.visa_needed.should.equal(jobPost.visa_needed);
            job.job_type[0].should.equal(jobPost.job_type[0]);
            job.positions[0].should.equal(jobPost.positions[0]);
            job.positions[1].should.equal(jobPost.positions[1]);
            job.expected_salary_min.should.equal(jobPost.expected_salary_min);
            job.expected_salary_max.should.equal(jobPost.expected_salary_max);
            job.required_skills[0].name.should.equal(jobPost.required_skills[0].name);
            job.not_required_skills[0].skills_id.toString().should.equal(jobPost.not_required_skills[0].skills_id.toString());
            job.num_people_desired.should.equal(jobPost.num_people_desired);
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

            res = await api.jobs.GET(companyUserDoc2.jwt_token, query)
            res.status.should.equal(200);

            job = res.body;
            job.name.should.equal(jobPost.name);
        })
    });
});