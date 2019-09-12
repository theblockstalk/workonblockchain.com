const Schema = require('mongoose').Schema;
const enumerations = require('../enumerations');

module.exports = new Schema({
    page_name:
        {
            type:String,
            enum: enumerations.pages,
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
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required:true
    },
    updated_date:
        {
            type:Date,
            required:true,
        }
});