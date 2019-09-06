const Schema = require('mongoose').Schema;
const regexes = require('../regexes');
const enumerations = require('../enumerations');
const candidateSchema = require('./candidates');

module.exports = new Schema({
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
        type:String
    },
    session_started: {
        type: Date
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
    hear_about_wob: {
        type: String,
        enum: enumerations.hearAboutWob
    },
    hear_about_wob_other_info:{
        type: String
    },
    candidate: {
        type: candidateSchema
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