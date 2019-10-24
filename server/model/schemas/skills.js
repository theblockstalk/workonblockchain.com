const Schema = require('mongoose').Schema;
const enumerations = require("../enumerations");

module.exports = new Schema({
    name: String,
    type: {
        type: String,
        enum: enumerations.skillsTpes
    },
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: Date
});