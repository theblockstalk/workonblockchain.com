const mongoose = require('mongoose');
const enumerations = require('./enumerations');

const Schema = mongoose.Schema;

const TokenSchema = new Schema({
    token_type: {
        type: String,
        enum: ['zoho'],
        required: true
    },
    zoho: {
        accesstoken: String,
        expirytime: Date,
        useridentifier: String,
        refreshtoken: String
    },
    last_modified: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Tokens',TokenSchema);


