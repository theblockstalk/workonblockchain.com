const Schema = require('mongoose').Schema;
const regexes = require('../regexes');

module.exports = new Schema({
    email: {
        type: String,
        validate: regexes.email,
        lowercase: true,
        required: true
    },
    url_token: {
        type: String,
        lowercase: true,
        required:true
    },
    discount : {
        type: Number,
        required : false
    },
    date_created: {
        type: Date
    }
});