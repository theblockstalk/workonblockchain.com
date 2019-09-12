const mongoose = require('mongoose');
const tokenSchema = require('../schemas/tokens');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Tokens',tokenSchema);

let mongooseFunctions = defaultMongoose(Model);

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;