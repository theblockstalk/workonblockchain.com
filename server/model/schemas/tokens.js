const Schema = require('mongoose').Schema;

module.exports = new Schema({
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