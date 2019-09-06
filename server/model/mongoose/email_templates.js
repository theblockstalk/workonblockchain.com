const mongoose = require('mongoose');
const emailSchema = require('../schemas/email_templates');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('email_templates', emailSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findAll = async function findAll() {
    return await Model.find().lean();
}

mongooseFunctions.findOneAndSort = async function findOne(selector) {
    return await Model.findOne(selector).sort({updated_date : -1}).lean();
}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function update(selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, {runValidators: true});
}

module.exports = mongooseFunctions;