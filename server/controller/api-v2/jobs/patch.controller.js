const Schema = require('mongoose').Schema;
const jobs = require('../../../model/mongoose/jobs');
const companies = require('../../../model/mongoose/companies');
const errors = require('../../services/errors');
const objects = require('../../services/objects');
const auth = require('../../middleware/auth-v2');
const enumerations = require('../../../model/enumerations');

module.exports.request = {
    type: 'patch',
    path: '/jobs'
};

const querySchema = new Schema({
    admin: Boolean,
    company_id: String,
    job_id: String
});

const bodySchema = new Schema({
    name: {
        type: String,
    },
    status: {
        type: String,
        enum: enumerations.jobStatus
    },
    work_type : {
        type: String,
        enum: enumerations.workTypes
    },
    locations: [{
        city_id: {
            type : Schema.Types.ObjectId,
            ref: 'Cities'
        },
        city: String,
        country: String,
        remote: Boolean,
    }],
    visa_needed: {
        type: Boolean,
        default:false
    },
    job_type: [{
        type: String,
        enum: enumerations.employmentTypes
    }],
    positions: {
        type: [{
            type: String,
            required : true,
            enum: enumerations.workRoles
        }]
    },
    expected_salary_min: {
        type: Number,
        min: 0
    },
    expected_salary_max: {
        type: Number,
        min: 0
    },
    expected_hourly_rate_min: {
        type: Number,
        min: 1
    },
    expected_hourly_rate_max: {
        type: Number,
        min: 1
    },
    currency: {
        type: String,
        enum: enumerations.currencies
    },
    num_people_desired: {
        type:Number,
        min: 0
    },
    required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
            exp_year: Number
        })]
    },
    not_required_skills: {
        type:[new Schema({
            skills_id: {
                type : Schema.Types.ObjectId,
                ref: 'Skills'
            },
            type: String,
            name: String,
        })]
    },
    description : {
        type : String,
        maxlength: 3000
    },
    unset_visa_needed: Boolean,
    unset_job_type: Boolean,
    unset_expected_salary_min: Boolean,
    unset_expected_salary_max: Boolean,
    unset_required_skills: Boolean,
    unset_not_required_skills: Boolean

});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
    if (req.query.admin)  await auth.isAdmin(req);
    else  await auth.isCompanyType(req);
}

module.exports.endpoint = async function (req, res) {
    let company_id;
    if (req.query.admin) {
        company_id = req.query.company_id
    }
    else {
        const companyDoc = await companies.findOne({_creator: req.auth.user._id});
        company_id = companyDoc._id
    }
    const timestamp = new Date();

    let jobDocUpdate = {};
    const jobId = req.query.job_id;
    const jobUpdate = req.body;

    const currentJobDoc = await jobs.findOneById(jobId);
    if (currentJobDoc.company_id.toString() !== company_id.toString())
        errors.throwError("Not authorized to edit this job", 400);

    if (jobUpdate.name) jobDocUpdate.name = jobUpdate.name;
    if (jobUpdate.status) jobDocUpdate.status = jobUpdate.status;
    if (jobUpdate.work_type) jobDocUpdate.work_type = jobUpdate.work_type;
    if (jobUpdate.locations) jobDocUpdate.locations = jobUpdate.locations;
    if (jobUpdate.visa_needed) jobDocUpdate.visa_needed = jobUpdate.visa_needed;
    if (jobUpdate.job_type) jobDocUpdate.job_type = jobUpdate.job_type;
    if (jobUpdate.positions) jobDocUpdate.positions = jobUpdate.positions;
    if (jobUpdate.expected_salary_min) jobDocUpdate.expected_salary_min = jobUpdate.expected_salary_min;
    if (jobUpdate.expected_salary_max) jobDocUpdate.expected_salary_max = jobUpdate.expected_salary_max;
    if (jobUpdate.expected_hourly_rate_min) jobDocUpdate.expected_hourly_rate_min = jobUpdate.expected_hourly_rate_min;
    if (jobUpdate.expected_hourly_rate_max) jobDocUpdate.expected_hourly_rate_max = jobUpdate.expected_hourly_rate_max;
    if (jobUpdate.currency) jobDocUpdate.currency = jobUpdate.currency;
    if (jobUpdate.num_people_desired) jobDocUpdate.num_people_desired = jobUpdate.num_people_desired;
    if (jobUpdate.required_skills) jobDocUpdate.required_skills = jobUpdate.required_skills;
    if (jobUpdate.not_required_skills) jobDocUpdate.not_required_skills = jobUpdate.not_required_skills;
    if (jobUpdate.description) jobDocUpdate.description = jobUpdate.description;
    if (jobUpdate.job_type) jobDocUpdate.job_type = jobUpdate.job_type;

    let unset = {};
    if (jobUpdate.unset_visa_needed) unset.visa_needed = 1;
    if (jobUpdate.unset_job_type) unset.job_type = 1;
    if (jobUpdate.unset_expected_salary_min) unset.expected_salary_min = 1;
    if (jobUpdate.unset_expected_salary_max) unset.expected_salary_max = 1;
    if (jobUpdate.unset_required_skills) unset.required_skills = 1;
    if (jobUpdate.unset_not_required_skills) unset.not_required_skills = 1;

    jobDocUpdate.modified = timestamp;

    let update = {$set: jobDocUpdate};
    if (!objects.isEmpty(unset)) update.$unset = unset;

    await jobs.updateOne({_id: jobId}, update);
    const jobDoc = await jobs.findOne({_id: jobId});
    res.send(jobDoc)
}