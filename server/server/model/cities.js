const mongoose = require('mongoose');
const CitiesSchema = mongoose.Schema({
	city_name: 
	{
		type:Array,
		required:true,
		unique: true
	},
	created_data: 
	{
		type:Date,
		required:true
	},
	updated_date:
	{
		type:Date,
		required:true
	},
	is_active:
	{
		type:Boolean
	},
	category_id : 
	{ 
		type: String, 
		ref: 'Country' 
	},

});
const Cities = module.exports = mongoose.model('Cities', CitiesSchema);




