const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const ChatSchema = new Schema({
	sender_id: 
	{
        type: Schema.Types.ObjectId,
        ref: 'User',
		required:true
	},
	receiver_id: 
	{
		type: Schema.Types.ObjectId,
        ref: 'User',
		required:true
	},
    msg_tag:
	{
		type:String,
		enum: enumerations.chatMsgTypes,
		required: true
	},
    is_read:
	{
		type:Boolean,
		required:true,
		default:false

	},
    date_created:
	{
		type: Date,
		required: true
	},
    message: {
        file: {
            url: {
                type: String,
                required: false
            }
        },
        normal: {
            message: {
                type: String,
                required: false
            }
        },
        job_offer: {
            title: {
                type:String,
                required: false
            },
            salary: {
                type: Number,
                required: false
            },
            salary_currency: {
                type: String,
                enum: enumerations.currencies,
                required: false
            },
            type: {
                type: String,
                enum: enumerations.jobTypes,
                required: false
            },
            location: {
                type: String,
                required: false
            },
            description: {
                type:String,
                required:false
            }
        },
        job_offer_accepted: {
            message: {
                type: String,
                required: false
            }
        },
        job_offer_rejected: {
            message: {
                type: String,
                required: false
            }
        },
        interview_offer: {
            location: {
                type: String,
                required: false
            },
            description:{
                type: String,
                required: false
            },
            date_time: {
                type: Date,
                required: false
            }
        },
        employment_offer: {
            title: {
                type:String,
                required: false
            },
            salary: {
                type: Number,
                required: false
            },
            salary_currency: {
                type: String,
                enum: enumerations.currencies,
                required: false
            },
            type: {
                type: String,
                enum: enumerations.jobTypes,
                required: false
            },
            start_date: {
                type: Date,
                required: false
            },
            description: {
                type:String,
                required:false
            },
            file_url: {
                type: String
            }
        },
        employment_offer_accepted: {
            employment_offer_reference:{
                type: Schema.Types.ObjectId,
                ref: 'Chat',
                required:false
            },
            message: {
                type: String,
                required: false
            }
        },
        employment_offer_rejected: {
            employment_offer_reference:{
                type: Schema.Types.ObjectId,
                required: false,
                ref: 'Chat'
            },
            message: {
                type: String,
                required: false
            }
        }
    }
});

module.exports = mongoose.model('Chat',ChatSchema);