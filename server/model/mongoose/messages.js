const mongoose = require('mongoose');
const msgSchema = require('../schemas/messages');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Messages', msgSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.findMany = async function (selector) {
    return await Model.find(selector).sort({date_created: 1}).lean();
}

mongooseFunctions.find = async function (selector) {
    return await Model.findOne(selector).sort({date_created: 'descending'}).lean();
}

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    return await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;