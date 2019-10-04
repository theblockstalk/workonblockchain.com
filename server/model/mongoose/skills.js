const mongoose = require('mongoose');
const skillsSchema = require('../schemas/skills');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Skills', skillsSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findAndLimit4 = async function findAndLimit4(selector) {
    return await Model.find(selector).limit(4).lean();
}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;