const mongoose = require('mongoose');
const syncSchema = require('../schemas/sync_queue');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Sync_queues',syncSchema);

let mongooseFunctions = defaultMongoose(Model);

mongooseFunctions.updateMany = async function (selector, updateObj) {
    await Model.updateMany(selector, updateObj, { runValidators: true });
}

mongooseFunctions.deleteMany = async function (selector) {
    await Model.deleteMany(selector);
}

module.exports = mongooseFunctions;