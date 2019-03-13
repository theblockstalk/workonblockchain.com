let Page = require('../pages_content');

module.exports.insert = async function insert(data) {
    let newDoc = new Page(data);
    await newDoc.save();
    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Page.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Page.findById(id).lean();
}

module.exports.findByDescDate = async function findByDescDate(selector) {
    return await Page.findOne(selector).sort({updated_date: 'descending'}).lean();
}