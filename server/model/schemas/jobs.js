const Schema = require('mongoose').Schema;
const regexes = require('../regexes');
const enumerations = require('../enumerations');

module.exports = new Schema({
    company_id: {
        type : Schema.Types.ObjectId,
        ref: Company
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["open", "closed", "paused"]
    },
    work_type : {
        type: String,
        enum: enumerations.workTypes
    },
    location: {
        type: [{
            city: {
                type : Schema.Types.ObjectId,
                ref: 'Cities'
            },
            remote: Boolean,

        }]
    },
    visa_needed: {
        type: Boolean,
        default:false,
    },
    job_type: {
        type: [{
            type: String,
            enum: enumerations.employmentTypes
        }]

    },
    position: {
        type: [{
            type: String,
            required : true,
            enum: enumerations.workRoles
        }]
    },
    current_salary: {
        type: Number,
        min: 0
    },
    expected_salary_min: {
        type: Number,
        min: 0
    },
    expected_salary_max: {
        type: Number,
        min: 0
    },
    current_currency: {
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
    residence_country: {
        type: [{
            type: String,
            enum: enumerations.countries
        }]
    },
    description : {
        type : String,
        maxlength: 3000
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