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
	sender_name: 
	{
		type:String,
		required:true
	},
	receiver_name: 
	{
		type:String,
		ref: 'User',
        required:true
	},
	message:
	{
		type:String,
		required:false
	},
	description:
	{
		type:String,
		required:false
	},
	job_title:
	{
		type:String
	},
	salary:
	{
		type:Number
	},
	salary_currency: {
		type: String,
		enum: ['£ GBP' ,'€ EUR' , '$ USD', '']
 	},
	date_of_joining: //used in case of offer to employ
	{
		type:Date // Date
	},
	msg_tag: 
	{
		type:String,
		enum: ['normal', 'job_offer','job_offered', 'job_offer_accepted','job_offer_rejected', 'interview_offer'],
		required: true
	},
	is_company_reply: 
	{
		type:Number, // 0 = false, 1 = true ???
		enum: [0, 1],
		default:0
	},
	job_type: 
	{
		type:String,
		enum: ['Full Time', 'Part Time','Contract', '']
	},
	interview_location: 
	{
		type:String
	},
	interview_date_time: 
	{
		type: Date // Date and time for interview offer
	},
	file_name: 
	{
		type:String
		//validate: regexes.url
	},
	is_job_offered: 
	{
        enum: [0, 1, 2, 3],
		// 0 = no offer to candidate
        // 1 = job offered
        // 2 = job offer accepted by candidate
        // 3 = job offer rejected by candidate
		default:0
	},
	is_read: 
	{
		type:Number, // 0 = false, 1 = true
        enum: [0, 1],
		default:0
	},
	date_created:
	{
		type: Date,
		required: true
	}
});

module.exports = mongoose.model('Chat',ChatSchema);