const mongoose = require('mongoose');

const ChatSchema = mongoose.Schema({
	sender_id: 
	{
        type: String,
		ref: 'User', // Is this right???
        required:true
	},
	receiver_id: 
	{
		type: String,
        ref: 'User', // Is this right???
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
		required:true
	},
	message: 
	{
		type:String,
		required:true
	},
	job_title: 
	{
		type:String
	},
	salary: // we need to also capture currency
	{
		type:String
	},
	date_of_joining: 
	{
		type:String // Date
	},
	msg_tag: 
	{
		type:String,
		// enum: ['normal', 'job_offer', 'job_offer_accepted',
		// 	'job_offer_rejected', 'interview_offer'],
		// // TODO: complete this
		required: true
	},
	is_company_reply: 
	{
		type:Number // 0 = false, 1 = true ???
	},
	job_type: 
	{
		type:String,
		enum: ['Full Time', 'Part Time','','Contract']
	},
	interview_location: 
	{
		type:String
	},
	interview_time: 
	{
		type:String
	},
	file_name: 
	{
		type:String
	},
	is_job_offered: 
	{
		type:Number, // 0 = false, 1 = true ???
		default:0
	},
	is_read: 
	{
		type:Number, // 0 = false, 1 = true ???
		required:true,
		default:0
	},
	date_created:
	{
		type: String, // Date
		required: true
	}
});

module.exports = mongoose.model('Chat',ChatSchema);




