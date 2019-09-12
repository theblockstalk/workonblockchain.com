const Schema = require('mongoose').Schema;
const userSchema = require('./users');

module.exports = new Schema({
    queue: {
        type: String,
        enum: ['user'],
        required: true
    },
    operation: {
        type: String,
        enum: ['POST', 'PATCH'],
        required: true
    },
    user: userSchema,
    added_to_queue: {
        type: Date,
        required: true
    }
});

