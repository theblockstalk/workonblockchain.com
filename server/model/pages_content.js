const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PagesSchema = new Schema({
	page_name: 
	{
		type:String,
		enum: ['Privacy Policy', 'Terms and Condition for candidate', 'Terms and Condition for company', 'FAQ','Candidate popup message', 'Company popup message'],
		required:true,
	},
	page_title: 
	{
		type:String,
		required:true,
	},	
	page_content: 
	{
		type:String,
		required:true,
	},	
	updated_date:
	{
		type:Date,
		required:true,
	}
});

module.exports = mongoose.model('pages_content', PagesSchema);




