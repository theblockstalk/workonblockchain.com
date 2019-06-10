const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const EmailTemplateSchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    body: {
        type:String,
        required:true,
    },
    updated_by: {
        type: Schema.Types.ObjectId,
        ref: "Users",
        required:true
    },
    updated_date: {
        type:Date,
        required:true,
    }
});

module.exports = mongoose.model('email_templates', EmailTemplateSchema);




