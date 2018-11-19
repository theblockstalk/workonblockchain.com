const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email:
        {
            type:String,
            validate: regexes.email,
            lowercase: true,
            required:true
        },
    linkedin_id :
        {
            type: String
        },
    password_hash:
        {
            type:String,
            required:true
        },
    salt:
        {
            type: String,
            required: true
        },
    type:
        {
            type:String,
            enum: ['candidate', 'company'],
            required:true
        },
    is_verify:
        {
            type:Number, // 0 = false, 1 = true
            enum: [0, 1],
            default:0
        },
    social_type:
        {
            type:String,
            enum: ['GOOGLE', 'LINKEDIN', '']
        },
    is_approved:
        {
            type:Number, // 0 = false, 1 = true
            enum: [0, 1],
            required:true,
            default:0
        },
    jwt_token:
        {
            type:String,
        },
    verify_email_key:
        {
            type:String, // This is a hash
        },
    forgot_password_key:
        {
            type:String, // This is a hash
        },
    ref_link: // DELETE ME
        {
            type:String,
            // validate: regexes.url
        },
    refered_id: // DELETE ME
        {
            type: Schema.Types.ObjectId,
            //ref : 'Referrals' // UNCOMMENT ME
        },
    referred_email :
        {
            type:String
        },
    is_admin:
        {
            type:Number, // 0 = false, 1 = true
            enum: [0, 1],
            required:true,
            default:0
        },
    is_unread_msgs_to_send:
        {
            type:Boolean,
            default:true
        },
    disable_account:
        {
            type:Boolean,
            default:false
        },
    dissable_account_timestamp:
        {
            type:Date
        },
    viewed_explanation_popup:
        {
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
            blockchain: {
                type: {
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
            }
        }
    },
    company: {
        saved_searches:
            {
                type:[new Schema({
                    location: {
                        type: String,
                        enum: enumerations.workLocations
                    },
                    job_type: {
                        type: String,
                    },
                    position:
                        {
                            type: [{
                                type: String,
                                enum: enumerations.workRoles
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
                    blockchain:
                        {
                            type: [{
                                type: String,
                                enum: enumerations.blockchainPlatforms
                            }]
                        },
                    skills: {
                        type: String,
                        enum: enumerations.programmingLanguages
                    },
                    receive_email_notitfications: {
                        type: Boolean
                    },
                    when_receive_email_notitfications : {
                        type : String ,
                        enum : enumerations.email_notificaiton
                    },
                    last_email_sent: {
                        Type: Date
                    }
                })]
            }

    },
    created_date:
        {
            type: Date
        }

});

module.exports = mongoose.model('User', UserSchema);




