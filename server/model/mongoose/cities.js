const mongoose = require('mongoose');
const citiesSchema = require('../schemas/cities');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Cities', citiesSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findAndLimit4 = async function findAndLimit4(selector) {
    return await Model.find(selector).limit(4).lean();
}

mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;