const Schema = require('mongoose').Schema;
const regexes = require('../regexes');
const enumerations = require('../enumerations');

module.exports = {
    job_activity_status:{
        type: {
            new_work_opportunities: {
                type: String,
                enum: enumerations.jobActivityStatus
            },
            currently_employed:{
                type:String,
                enum: ['Yes','No']
            },
            leaving_current_employ_reasons:{
                type: [{
                    type: String,
                    enum: enumerations.leavingCurrentEmployReasons
                }]
            },
            other_reasons:{ //leaving_current_employ_reasons is other then it will be filled
                type: String
            },
            counter_offer:{
                type:String,
                enum: ['Yes','No']
            }
        }
    },
    base_city: String,
    base_country: {
        type: String,
        enum: enumerations.countries
    },
    terms_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
    privacy_id: {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
    github_account: {
        type:String,
        validate: regexes.url
    },
    stackexchange_account: {
        type:String,
        validate: regexes.url
    },
    linkedin_account: {
        type:String,
        validate: regexes.url
    },
    medium_account: {
        type:String,
        validate: regexes.url
    },
    stackoverflow_url: {
        type:String,
        validate: regexes.url
    },
    personal_website_url: {
        type:String,
        validate: regexes.url
    },
    employee: {
        type: {
            employment_type :  {
                type : String,
                enum: enumerations.employmentTypes
            },
            expected_annual_salary: {
                type: Number,
                min:0
            },
            currency : {
                type: String,
                enum: enumerations.currencies
            },
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    country: enumerations.countries,
                    remote: Boolean,
                    visa_needed: {
                        type: Boolean,
                        required: true,
                    }
                }
                ]
            },
            roles: {
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            employment_availability: {
                type:String,
                enum: enumerations.workAvailability
            },
            opportunities_of_interest: {
                type:String,
                maxlength: 3000
            }
        }
    },
    contractor: {
        type: {
            expected_hourly_rate:  {
                type : Number,
                min:0,
            },
            currency: {
                type: String,
                enum: enumerations.currencies
            },
            max_hour_per_week : {
                type : Number,
                min:0,
            },
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    country: enumerations.countries,
                    remote: Boolean,
                    visa_needed: {
                        type: Boolean,
                        required: true,
                    }
                }]
            },
            roles: {
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            contractor_type: {
                type: String,
                enum: enumerations.contractorTypes
            },
            agency_website: {
                type: String,
                validate: regexes.url
            },
            service_description: {
                type: String,
                maxlength: 3000
            }
        }
    },
    volunteer: {
        type: {
            location: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    country: enumerations.countries,
                    remote: Boolean,
                    visa_needed: {
                        type: Boolean,
                        required: true,
                    }
                }]
            },
            roles: {
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            max_hours_per_week: {
                type: Number,
                min: 0
            },
            learning_objectives: {
                type: String,
                maxlength: 3000

            }
        }
    },
    current_currency: {
        type: String,
        enum: enumerations.currencies
    },
    current_salary: {
        type:Number,
        min: 0
    },
    why_work: String,
    programming_languages: {
        type:[new Schema({
            language: {
                type: String,
                enum: enumerations.programmingLanguages
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
        })]
    },
    description: {
        type:String,
        maxlength: 3000
    },
    education_history: {
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
            eduyear: Number
        })]
    },
    work_history: {
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
            description: {
                type: String,
                maxlength: 3000
            },
            startdate: Date,
            enddate: Date,
            currentwork: {
                type: Boolean,
                required: true
            }
        })],
    },
    interest_areas: {
        type:[{
            type: String,
            enum: enumerations.workBlockchainInterests
        }]
    },
    blockchain: {
        type: {
            commercial_platforms: {
                type: [{
                    name: {
                        type: String,
                        enum: enumerations.blockchainPlatforms
                    },
                    exp_year: {
                        type: String,
                        enum: enumerations.experienceYears
                    }
                }]
            },
            description_commercial_platforms:{
                type: String,
                maxlength: 3000
            },
            experimented_platforms: {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }],
            },
            description_experimented_platforms:{
                type: String,
                maxlength: 3000
            },
            commercial_skills : {
                type: [{
                    skill: {
                        type: String,
                        enum: enumerations.otherSkills
                    },
                    exp_year: {
                        type: String,
                        enum: enumerations.exp_years
                    }
                }],
            },
            description_commercial_skills:{
                type: String,
                maxlength: 3000
            },
        }
    },
    status:{ //DELETE ME
        type:[{
            status: {
                type: String,
                enum: enumerations.candidateStatus,
                required:true,
            },
            reason: {
                type: String,
                enum: enumerations.statusReasons
            },
            timestamp: {
                type: Date,
                required:true,
            }
        }]
    },
    history : {
        type : [{
            status:{
                type:{
                    status: {
                        type: String,
                        enum: enumerations.candidateStatus,
                        required:true,
                    },
                    reason: {
                        type: String,
                        enum: enumerations.statusReasons
                    }
                },
                required: false
            },
            note : String,
            email_html : String,
            email_subject : String,
            timestamp: {
                type: Date,
                required:true,
            }
        }]

    },
    latest_status : {
        status: {
            type: String,
            enum: enumerations.candidateStatus,
            required:true,
        },
        reason: {
            type: String,
            enum: enumerations.statusReasons
        },
        timestamp: {
            type: Date,
            required:true,
        }

    }
}