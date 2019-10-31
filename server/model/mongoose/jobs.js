const mongoose = require('mongoose');
const jobsSchema = require('../schemas/jobs');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Jobs', jobsSchema);

let mongooseFunctions = defaultMongoose(Model);

module.exports = mongooseFunctions;