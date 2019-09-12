const Schema = require('mongoose').Schema;

module.exports = new Schema({
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