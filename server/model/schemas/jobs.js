const Schema = require('mongoose').Schema;
const regexes = require('../regexes');
const enumerations = require('../enumerations');

module.exports = new Schema({
    company_id: {
        type : Schema.Types.ObjectId,
        ref: "CompanyProfile",
        reqired: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: enumerations.jobStatus,
        default: "open"
    },
    work_type : {
        type: String,
        enum: enumerations.workTypes,
        required: true
    },
    locations: {
        type: [{
            city_id: {
                type : Schema.Types.ObjectId,
                ref: 'Cities'
            },
            city: String,
            country: String,
            remote: Boolean,
        }],
        required: true
    },
    visa_needed: {
        type: Boolean,
        default:false,
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
        }],
        required: true
    },
    expected_salary_min: {
        type: Number,
        min: 0
    },
    expected_salary_max: {
        type: Number,
        min: 0
    },
    num_people_desired: {
        type:Number,
        min: 0,
        required: true
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
        maxlength: 3000,
        required: true
    },
    created : {
        type : Date,
        required: true
    },
    modified : {
        type : Date,
        required: true
    }
});