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
                required: true
            }
        },
        job_offer: {
            title: {
                type:String,
                required: true
            },
            salary: {
                type: Number,
                required: true
            },
            salary_currency: {
                type: String,
                enum: enumerations.currencies,
                required: true
            },
            type: {
                type: String,
                enum: enumerations.jobTypes,
                required: true
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
                required: true
            },
            date_time: {
                type: Date,
                required: true
            }
        },
        employment_offer: {
            title: {
                type:String,
                required: true
            },
            salary: {
                type: Number,
                required: true
            },
            salary_currency: {
                type: String,
                enum: enumerations.currencies,
                required: true
            },
            type: {
                type: String,
                enum: enumerations.jobTypes,
                required: true
            },
            start_date: {
                type: Date,
                required: true
            },
            description: {
                type:String,
                required:false
            },
            file_url: {
                type: String,
                required: false,
                validate: regexes.url
            }
        },
        employment_offer_accepted: {
            employment_offer_reference:{
                type: Schema.Types.ObjectId,
                ref: 'Chat',
                required:true
            },
            message: {
                type: String,
                required: false
            }
        },
        employment_offer_rejected: {
            employment_offer_reference:{
                type: Schema.Types.ObjectId,
                required: true,
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