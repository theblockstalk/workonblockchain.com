const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema({
	terms:
    {
        type:Boolean
    },
    terms_id:
    {
        type: Schema.Types.ObjectId,
        ref: 'pages_content'
    },
    marketing_emails:
    {
    	type:Boolean,
    	default:false
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
        type:String,
        validate: regexes.url
    },
    company_phone:
    {
        type:String
    },
    company_country:
    {
        type: String,
        enum: enumerations.countries
    },
    company_city:
    {
        type:String
    },
    company_postcode:
    {
        type:String
    },
    company_founded:
    {
        type:Number,
        min: 1800
    },
    no_of_employees:
    {
    	type:Number,
        min: 1
    },
    company_funded:
    {
    	type:String
    },
    company_logo:
    {
    	type: String,
        validate: regexes.url
    },
    company_description:
    {
    	type: String,
        maxlength: 3000
    },       

    _creator : 
    { 
        type: Schema.Types.ObjectId,
        ref: 'User' 
    },


});

module.exports = mongoose.model('CompanyProfile',CompanyProfileSchema);


