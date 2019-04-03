const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema({
    terms_id: {
            type: Schema.Types.ObjectId,
            ref: 'pages_content'
    },
    marketing_emails: {
            type:Boolean,
            default:false
    },
    first_name: {
            type:String
    },
    last_name: {
            type:String
    },
    job_title: {
            type:String
    },
    company_name: {
            type:String
    },
    company_website: {
            type:String,
            validate: regexes.url
    },
    company_phone: {
            type:String
    },
    company_country: {
            type: String,
            enum: enumerations.countries
    },
    company_city: {
            type:String
    },
    company_postcode: {
            type:String
    },
    company_founded: {
            type:Number,
            min: 1800
    },
    no_of_employees: {
            type:Number,
            min: 1
    },
    company_funded: {
            type:String
    },
    company_logo: {
            type: String,
            validate: regexes.url
    },
    company_description: {
            type: String,
            maxlength: 3000
    },

    saved_searches: {
        type:[new Schema({
            name: {
                type: String,
                required: true
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
                    required : true,
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
            current_currency: {
                type: String,
                required : true,
                enum: enumerations.currencies
            },
            current_salary: {
                type:Number,
                required : true,
                min: 0
            },
            expected_hourly_rate: {
                type:Number,
                required : true,
                min: 0
            },
            currency: {
                type: String,
                required : true,
                enum: enumerations.currencies
            },
            blockchain: {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            },
            skills: {
                type: [{
                    type: String,
                    enum: enumerations.programmingLanguages
                }]
            },
            residence_country: {
                type: [{
                    type: String,
                    enum: enumerations.countries
                }]
            },
            other_technologies : {
                type : String
            },
            when_receive_email_notitfications : { //DELETE ME
                type : String ,
                enum : enumerations.email_notificaiton
            },
            order_preferences : {
                type: [{
                    type: String,
                    enum: enumerations.blockchainPlatforms
                }]
            },
            timestamp : {
                type : Date,
                required: true
            }
        })]
    },
    when_receive_email_notitfications : {
        type : String ,
        enum : enumerations.email_notificaiton
    },
    candidates_sent_by_email: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        sent: {
            type: Date,
            required: true
        }
    }],

    last_email_sent: {
        type: Date
    },

    _creator : {
            type: Schema.Types.ObjectId,
            ref: 'User'
    },


});

module.exports = mongoose.model('CompanyProfile',CompanyProfileSchema);


