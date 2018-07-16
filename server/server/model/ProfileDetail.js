const mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ProfileDetailSchema = mongoose.Schema({
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
    country:
    {
        type:Array,
        
    },
    roles:
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
    availability:
    {
        type:Date,
        
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
const ProfileDetail = module.exports = mongoose.model('ProfileDetail',ProfileDetailSchema);


