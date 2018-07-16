const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const CompanyProfileSchema = mongoose.Schema({
	terms:
    {
    	type:Boolean  	
    },
    marketing_emails:
    {
    	type:Boolean
    },
    first_name:
    {
        type:String
    },
    last_name:
    {
        type:String
    },
    job_title:
    {
        type:String
    },
    company_name:
    {
        type:String
    },
    company_website:
    {
        type:String
    },
    company_phone:
    {
        type:String
    },
    company_country:
    {
        type:String
    },
    company_city:
    {
        type:String
    },
    company_postcode:
    {
        type:Number
    },
    company_pay:
    {
    	type:Boolean ,
    	
    },
    company_declare:
    {
    	type:Boolean ,
		
    },
    company_found:
    {
    	type:Boolean ,
		
    },
    only_summary:
    {
    	type:Boolean ,
		
    },
    company_founded:
    {
        type:String
    },
    no_of_employees:
    {
    	type:String
    },
    company_funded:
    {
    	type:String
    },
    company_logo:
    {
    	type:String
    },
    company_description:
    {
    	type:String
    },       

    _creator : 
    { 
        type: String, 
        ref: 'User' 
    },


});
const CompanyProfile = module.exports = mongoose.model('CompanyProfile',CompanyProfileSchema);


