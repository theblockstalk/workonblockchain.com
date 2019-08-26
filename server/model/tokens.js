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
        access_token: String,
        expires_in: Number,
        user_identifier: String,
        refresh_token: String
    },
    last_modified: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Tokens',TokenSchema);


