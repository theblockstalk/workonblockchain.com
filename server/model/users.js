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
    refered_id:
        {
            type: Schema.Types.ObjectId,
            ref : 'Referrals'
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
            }
        }
    },
    created_date:
        {
            type: Date
        }

});

module.exports = mongoose.model('User', UserSchema);




