const mongoose = require('mongoose');
const referralSchema = require('../schemas/referrals');

let Referral = mongoose.model('Referrals', referralSchema);

module.exports.insert = async function insert(data) {
    let newDoc = new Referral(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Referral.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Referral.findById(id).lean();
}

module.exports.findOneByEmail = async function findOneByEmail(email) {
    return await Referral.findOne({email: email}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Referral.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Referral.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            Referral.count(selector, (err1, result) => {
                if (err1) reject(err1);
                resolve(result);
            })
        } catch (err2) {
            reject(err2);
        }
    })
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Referral.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}