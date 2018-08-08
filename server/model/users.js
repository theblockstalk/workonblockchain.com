const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
	email: 
	{
		type:String,
		
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
		enum: ['candidate', 'company'],
		required:true
	},
	is_verify:
	{
		type:Number, // 0 = false, 1 = true
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
		required:true,
		default:0
	},
	email_hash: // What is this?
	// In staging database this = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJoYXNoIjoiZjQwZTY3N2ZlOGVlMzM2M2Y4NGI1MDczZDZmNDdmMDYiLCJlbWFpbCI6InNhZGlhLmFiYmFzQG13YW5tb2JpbGUuY29tIiwiZXhwaXJ5IjoiMjAxOC0wNy0yN1QxNzo0MToyMS42NTdaIn0.jBchvNvFMFiDW97bP8D5sV5QtLN0QU7Nf0zbYNsLJGI" for all users
	{	
		type:String,
	},
	// Need to store salt for each user
	// passwordHash = hash(passwordPlainText + salt);
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
	// social_type: // This is duplicated
	// {
	// 	type:String
	// },
	// is_approved:
	// {
	// 	type:Number,
	// 	required:true,
	// 	default:0
	// },
	// email_hash:
	// {
	// 	type:String,
    //
	// },
	// password_key:
	// {
	// 	type:String,
	// },
	is_admin:
	{
		type:Number, // 0 = false, 1 = true
		required:true,
		default:0
	},	
	is_unread_msgs_to_send:
	{
		type:Boolean,
    	default:true
	},
	created_date:
	{
		type: String // Date
	}

});

module.exports = mongoose.model('User', UserSchema);




