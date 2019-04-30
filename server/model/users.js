const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type:String,
        validate: regexes.email,
        lowercase: true,
        required:true
    },
    marketing_emails: {
        type:Boolean,
        default:false
    },
    first_name: String,
    last_name: String,
    contact_number: String,
    nationality: {
        type: [{
            type: String,
            enum: enumerations.nationalities
        }]
    },
    image: {
        type: String,
        validate: regexes.url
    },
    sendgrid_id: {
        type: String
    },
    linkedin_id : {
        type: String
    },
    google_id : {
        type: String
    },
    password_hash: {
        type:String,
    },
    salt: {
        type: String,
    },
    type: {
        type:String,
        enum: ['candidate', 'company'],
        required:true
    },
    is_verify: {
        type:Number, // 0 = false, 1 = true
        enum: [0, 1],
        default:0
    },
    social_type: { //DELETE ME
        type:String,
        enum: ['GOOGLE', 'LINKEDIN', '']
    },
    is_approved: {
        type:Number, // 0 = false, 1 = true
        enum: [0, 1],
        required:true,
        default:0
    },
    jwt_token: {
        type:String,
    },
    verify_email_key: {
        type:String, // This is a hash
    },
    forgot_password_key: {
        type:String, // This is a hash
    },
    referred_email : {
        type:String
    },
    is_admin: {
        type:Number, // 0 = false, 1 = true
        enum: [0, 1],
        required:true,
        default:0
    },
    is_unread_msgs_to_send: {
        type:Boolean,
        default:true
    },
    last_message_reminder_email: {
        type:Date
    },
    disable_account: {
        type:Boolean,
        default:false
    },
    dissable_account_timestamp: {
        type:Date
    },
    viewed_explanation_popup: {
        type:Boolean,
        default:false
    },
    candidate: {
        type: {
            base_city: String,
            base_country: {
                type: String,
                enum: enumerations.countries
            },
            terms_id: {
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
            locations: { //DELETE ME
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
            roles: { //DELETE ME
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            expected_salary_currency: { //DELETE ME
                type: String,
                enum: enumerations.currencies
            },
            expected_salary: { //DELETE ME
                type:Number,
                min: 0
            },
            availability_day: { //DELETE ME
                type:String,
                enum: enumerations.workAvailability
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
                        type:[{
                            status: {
                                type: String,
                                enum: enumerations.candidateStatus,
                                required:true,
                            },
                            reason: {
                                type: String,
                                enum: enumerations.statusReasons
                            }
                        }],
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
    },
    conversations: [new Schema({
        user_id: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required:true
        },
        count: {
            type: Number,
            required: true,
            default:0
        },
        unread_count: {
            type: Number,
            required: true,
            default:0
        },
        last_message: {
            type: Date,
            required: true
        }
    })],
    first_approved_date:{
        type: Date
    },
    created_date: {
        type: Date
    }

});

module.exports = mongoose.model('User', UserSchema);