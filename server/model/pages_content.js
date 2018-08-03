const mongoose = require('mongoose');
const PagesSchema = mongoose.Schema({
	page_name: 
	{
		type:String,
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
		type:String, // Date
		required:true,
	}
});

module.exports = mongoose.model('pages_content', PagesSchema);




