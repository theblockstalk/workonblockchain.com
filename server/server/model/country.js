const mongoose = require('mongoose');
const CountrySchema = mongoose.Schema({
	country_name: 
	{
		type:String,
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
	}

});
const Country = module.exports = mongoose.model('Country',CountrySchema);




