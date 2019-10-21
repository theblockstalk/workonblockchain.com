const mongo = require('../../helpers/mongo');
const api = require('../api');

const users = require('../../../model/mongoose/users');
const skills = require('../../../model/mongoose/skills');

const docGenerator = require('../../helpers/docGenerator-v2');
const companyHelper = require('../otherHelpers/companyHelpers');
const skillsHelper = require('../skills/helpers');
const citiesHelpers = require('../locations/helpers');

const enumerations = require('../../../model/enumerations');
const random = require('../../helpers/random');

const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const should = chai.should();

describe('POST /jobs', function () {
    let company, companyUserDoc, jwtToken;
    let skills1, skills2, city1, city2;
    let minJob;

    beforeEach(async function () {
        company = docGenerator.company();
        await companyHelper.signupCompany(company);
        companyUserDoc = await users.findOne({email: company.email});
        jwtToken = companyUserDoc.jwt_token;

        skills1 = await skillsHelper.createJob(companyUserDoc._id);
        skills2 = await skillsHelper.createJob(companyUserDoc._id);

        city1 = await citiesHelpers.insertCity();
        city2 = await citiesHelpers.insertCity();

        minJob = {
            name: random.string(20),
            status: "open",
            work_type : "employee",
            locations: [{
                city_id: city1._id,
                city: city1.city,
                country: city1.country
            }, {
                remote: true
            }],
            // visa_needed: false,
            job_type: "Full time",
            positions: ['Backend Developer', 'Frontend Developer'],
            expected_salary_min: 100000,
            // expected_salary_max: 200000,
            num_people_desired: 1,
            // required_skills: [{
            //     skills_id: ,
            //     type: String,
            //     name: String,
            //     exp_year: Number
            // }],
            // not_required_skills:[{
            //     skills_id: ,
            //     type: String,
            //     name: String,
            // }],
            description : random.string(200)
        };
    })

    afterEach(async function () {
        console.log('dropping database');
        await mongo.drop();
    })


    describe('create a job', function () {

        it('it should create a job', async function () {
            const res = await api.jobs.POST(jwtToken, null, minJob)
            res.status.should.equal(200);

            const job = res.body;
            job.name.should.equal(minJob.name);
            // check company doc
        })
    });
});