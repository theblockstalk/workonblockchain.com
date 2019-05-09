const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PagesSchema = new Schema({
    type:[{
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
        updated_date:
            {
                type:Date,
                required:true,
            }
    }]
});

module.exports = mongoose.model('pages_content', PagesSchema);




