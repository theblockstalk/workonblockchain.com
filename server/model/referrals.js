const mongoose = require('mongoose');
const regexes = require('./regexes');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const ReferralsSchema = new Schema({
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

module.exports = mongoose.model('Referrals',ReferralsSchema);