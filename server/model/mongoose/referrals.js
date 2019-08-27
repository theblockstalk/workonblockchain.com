const mongoose = require('mongoose');
const referralSchema = require('../schemas/referrals');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Referrals', referralSchema);

let mongooseFunctions = defaultMongoose(Model);

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function update(selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports = mongooseFunctions;