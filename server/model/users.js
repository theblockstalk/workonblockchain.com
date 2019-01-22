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
        type:String,
        enum: enumerations.nationalities
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
    password_hash: {
        type:String,
        required:true
    },
    salt: {
        type: String,
        required: true
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
    social_type: {
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
            locations: {
                type: [{
                    city: {
                        type : Schema.Types.ObjectId,
                        ref: 'Cities'
                    },
                    country: enumerations.countries,
                    visa_not_needed: Boolean,
                }]
            },
            roles: {
                type: [{
                    type: String,
                    enum: enumerations.workRoles
                }]
            },
            expected_salary_currency: {
                type: String,
                enum: enumerations.currencies
            },
            expected_salary: {
                type:Number,
                min: 0
            },
            current_currency: {
                type: String,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                min: 0
            },
            availability_day: {
                type:String,
                enum: enumerations.workAvailability
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
                    experimented_platforms: {
                        type: [{
                            type: String,
                            enum: enumerations.blockchainPlatforms
                        }]
                    },
                    smart_contract_platforms: {
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
                    commercial_skills : [new Schema({
                        skill: {
                            type: String,
                            enum: enumerations.otherSkills
                        },
                        exp_year: {
                            type: String,
                            enum: enumerations.exp_years
                        }
                    })],

                    formal_skills : [new Schema({
                        skill: {
                            type: String,
                            enum: enumerations.otherSkills
                        },
                        exp_year: {
                            type: String,
                            enum: enumerations.exp_years
                        }
                    })],
                }
            },
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
                    },
                    timestamp: {
                        type: Date,
                        required:true,
                    }
                }]
            }
        }
    },
    first_approved_date:{
        type: Date
    },
    created_date: {
        type: Date
    }

});

module.exports = mongoose.model('User', UserSchema);




