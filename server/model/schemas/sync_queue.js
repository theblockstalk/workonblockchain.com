const Schema = require('mongoose').Schema;
const userSchema = require('./users');
const companySchema = require('./companies');

module.exports = new Schema({
    queue: {
        type: String,
        enum: ['candidate', 'company'],
        required: true
    },
    operation: {
        type: String,
        enum: ['POST', 'PATCH'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'error'],
        required: true
    },
    user: userSchema,
    company: companySchema,
    added_to_queue: {
        type: Date,
        required: true
    },
    error_id: String
});

