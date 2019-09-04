const mongoose = require('mongoose');
const referralSchema = require('../schemas/referrals');
const defaultMongoose = require('../defaultMongoose');

let Model = mongoose.model('Referrals', referralSchema);

let mongooseFunctions = defaultMongoose(Model);

// TODO: need to change this to updateOne()
mongooseFunctions.update = async function (selector, updateObj) {
    await Model.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

mongooseFunctions.findOneByEmail = async function (email) {
    return await Model.findOne({email: email}).lean();
}

module.exports = mongooseFunctions;