const mongoose = require('mongoose');
const tokenSchema = require('../schemas/tokens');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Tokens',tokenSchema);

let mongooseFunctions = defaultMongoose(Model);

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    return await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

mongooseFunctions.findOneByType = async function(type) {
    return await Model.findOne({token_type: type}).lean();
}

module.exports = mongooseFunctions;