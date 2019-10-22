const Schema = require('mongoose').Schema;

module.exports = new Schema({
    name: String,
    type: String,
    added_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    created_date: Date
});