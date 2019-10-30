const Schema = require('mongoose').Schema;

module.exports = new Schema({
    city: String,
    country: String,
    active: {
        type: Boolean,
        default: true
    }
});