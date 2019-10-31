const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/companies');

const docGenerator = require('../../helpers/docGenerator-v2');
const companyHelper = require('../otherHelpers/companyHelpers');
const skillsHelper = require('../skills/helpers');
const citiesHelpers = require('../locations/helpers');

const enumerations = require('../../../model/enumerations');
const random = require('../../helpers/random');

module.exports.jobPost = async function() {
    const company = docGenerator.company();
    await companyHelper.signupCompany(company);
    const companyUserDoc = await users.findOne({email: company.email});

    const skills1 = await skillsHelper.createJob(companyUserDoc._id);
    const skills2 = await skillsHelper.createJob(companyUserDoc._id);

    const city1 = await citiesHelpers.insertCity();

    return {
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
        visa_needed: false,
        job_type: ["Full time"],
        positions: ['Backend Developer', 'Frontend Developer'],
        expected_salary_min: 100000,
        expected_salary_max: 200000,
        currency: random.enum(enumerations.currencies),
        num_people_desired: 1,
        required_skills: [{
            skills_id: skills1._id,
            type: skills1.type,
            name: skills1.name,
            exp_year: random.integer(1,6)
        }],
        not_required_skills:[{
            skills_id: skills2._id,
            type: skills2.type,
            name: skills2.name
        }],
        description : random.string(200)
    };
}