const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const CandidateProfileSchema = mongoose.Schema({
    first_name:
    {
        type:String
    },
    last_name:
    {
        type:String
    },
    github_account: 
    {
        type:String     
    },
    stackexchange_account: 
    {
        type:String     
    },
    contact_number: 
    {
        type: Number,
        
    },
    nationality: 
    {
        type:String,
    },
    image: 
    { 
        type:String,
        data: Buffer,
        
    },
    gender:
    {
        type:String,
    },
    country:
    {
        type:Array,
        
    },
    roles:
    {
        type:Array,
        
    },
    expected_salary_currency:
    {
        type:String,
    },
    expected_salary:
    {
        type:Number,
        
    },
    interest_area:
    {
        type:Array,
        
    },
    availability_day:
    {
        type:String,
        
    },
    availability_year:
    {
        type:String,
        
    },
    why_work:
    {
        type:String,
        
    },
    commercial_platform:
    {
        type:Array,
        
    },
    experimented_platform:
    {
        type:Array,
        
    },
    platforms:
    {
        type:Array,
        
    },
    current_currency:
    {
        type:String,
    },
    current_salary:
    {
        type:Number,
        
    },
    languages:
    {
        type:Array,
        
    },
    experience_roles:
    {
        type:Array,
        
    },

    work_experience:
    {
        type:Array,
        
    },
     work_experience_year:
    {
        type:Array,
        
    },
    education:
    {
        type:Array,
        
    },
    history:
    {
        type:Array,
    },
    description:
    {
        type:String,
        
    },

    _creator : 
    { 
        type: String, 
        ref: 'User' 
    },


});
const CandidateProfile = module.exports = mongoose.model('CandidateProfile',CandidateProfileSchema);


