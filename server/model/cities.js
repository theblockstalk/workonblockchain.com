const mongoose = require('mongoose');
const regexes = require('./regexes');

const Schema = mongoose.Schema;

const CitiesSchema = new Schema({
    _id: Schema.Types.ObjectId,
    city: String,
    country: String,
    active: Boolean,
});

module.exports = mongoose.model('Cities',CitiesSchema);


