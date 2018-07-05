const mongoose = require('mongoose');
const UserSchema = mongoose.Schema({
	email: 
	{
		type:String,
		required:true,
		unique: true
	},
	password: 
	{
		type:String,
		required:true
	},
	type:
	{
		type:String,
		required:true
	},

	is_verify:
	{
		type:Number,
		default:0
	},
	social_type:
	{
		type:String
	},
	is_approved:
	{	
		type:Number,
		required:true,
		default:0
	},
	email_hash:
	{	
		type:String,
	},
	password_key:
	{
		type:String,
	},
	ref_link:
	{
		type:String,
	},
	refered_id:
	{
		type:String,
	},
	social_type:
	{
		type:String
	},
	is_approved:
	{	
		type:Number,
		required:true,
		default:0
	},
	email_hash:
	{	
		type:String,

	},
	password_key:
	{
		type:String,
	},
	is_admin:
	{
		type:Number,
		required:true,
		default:0
	},	
	created_date:
	{
		type:String,
	}	

});
const User = module.exports = mongoose.model('User',UserSchema);




