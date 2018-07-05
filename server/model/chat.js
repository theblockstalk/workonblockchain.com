const mongoose = require('mongoose');
const ChatSchema = mongoose.Schema({
	sender_id: 
	{
		type:String,
		required:true
	},
	receiver_id: 
	{
		type:String,
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
	salary: 
	{
		type:String
	},
	date_of_joining: 
	{
		type:String
	},
	msg_tag: 
	{
		type:String
	},
	is_company_reply: 
	{
		type:Number
	},
	job_type: 
	{
		type:String
	},
	file_name: 
	{
		type:String
	},
	is_job_offered: 
	{
		type:Number,
		default:0
	},
	is_read: 
	{
		type:Number,
		required:true,
		default:0
	},
	date_created:
	{
		type:String
	}
});
const Chat = module.exports = mongoose.model('Chat',ChatSchema);




