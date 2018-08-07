const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const CandidateProfileSchema = new Schema({
    terms:
    {
    	type:Boolean
    },
    marketing_emails:
    {
    	type:Boolean,
    	default:false
    },
    disable_account:
    {
    	type:Boolean,
    	default:false
    },
    first_name:
    {
        type:String
    },
    last_name:
    {
        type:String
    },
    github_account:
    {
        type:String,
        validate: regexes.url
    },
    stackexchange_account:
    {
        type:String,
        validate: regexes.url
    },
    contact_number:
    {
        type: String
    },
    nationality:
    {
        type:String,
        enum: enumerations.nationalities
    },
    image:
    {
        type: String,
        validate: regexes.url
    },
    locations:
    {
        type: [{
            type: String,
            enum: enumerations.workLocations
        }]
    },
    roles:
    {
        type: [{
            type: String,
            enum: enumerations.workRoles
        }]
    },
    expected_salary_currency:
    {
        type: String,
        enum: enumerations.currencies
    },
    expected_salary:
    {
        type:Number,
        min: 0
    },
    interest_area:
    {
        type:[{
            type: String,
            enum: enumerations.workBlockchainInterests
        }]
    },
    availability_day:
    {
        type:String,
        enum: enumerations.workAvailability
    },
    why_work:
    {
        type:String
    },
    commercial_platform:
    {
        type: [{
            platform_name: {
                type: String,
                enum: enumerations.blockchainPlatforms
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
        }]
    },
    experimented_platform:
    {
        type: [{
            name: {
                type: String,
                enum: enumerations.blockchainPlatforms
            },
            value: {
                type: String,
                enum: enumerations.blockchainPlatforms
            },
            checked : Boolean
        }]

    },
    platforms:
    {
        type: [{
            platform_name: {
                type: String,
                enum: enumerations.blockchainPlatforms
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
        }]
    },
    current_currency: {
        type: String,
        enum: enumerations.currencies
    },
    current_salary:
    {
        type:Number,
        min: 0
    },
    programming_languages:
    {
        type:[{
            language: {
                type: String,
                enum: enumerations.programmingLanguages
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
        }]
    },
    education_history:
    {
        type:[new Schema({
            uniname: {
                type: String,
                required: true
            },
            degreename: {
                type: String,
                required: true
            },
            fieldname: {
                type: String,
                required: true
            },
            edudate: Date
        })]
    },
    work_history:
    {
        type:[new Schema({
            companyname: {
                type: String,
                required: true
            },
            positionname: {
                type: String,
                required: true
            },
            locationname: {
                type: String,
                required: true
            },
            description: String,
            startdate: Date,
            enddate: Date,
            currentwork: Boolean,
        })],
    },
    description:
    {
        type:String,
    },
    _creator : 
    { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },

});

module.exports = mongoose.model('CandidateProfile',CandidateProfileSchema);


