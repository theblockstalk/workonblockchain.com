const mongoose = require('mongoose');
const pageSchema = require('../schemas/pages');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('pages_content', pageSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findByDescDate = async function findByDescDate(selector) {
    return await Model.findOne(selector).sort({updated_date: 'descending'}).lean();
}

mongooseFunctions.findOneAndSort = async function findOne(selector) {
    return await Model.findOne(selector).sort({updated_date : -1}).lean();
}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function update(selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;