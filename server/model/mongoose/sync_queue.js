const mongoose = require('mongoose');
const syncSchema = require('../schemas/sync_queue');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Sync_queues',syncSchema);

let mongooseFunctions = defaultMongoose(Model);

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;