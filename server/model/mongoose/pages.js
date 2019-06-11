let Pages = require('../pages_content');

module.exports.insert = async function insert(data) {
    let newDoc = new Page(data);
    await newDoc.save();
    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Pages.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Pages.findById(id).lean();
}

module.exports.findByDescDate = async function findByDescDate(selector) {
    return await Pages.findOne(selector).sort({updated_date: 'descending'}).lean();
}

module.exports.insert = async function insert(data) {
    let newDoc = new Pages(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOneAndSort = async function findOne(selector) {
    return await Pages.findOne(selector).sort({updated_date : -1}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Pages.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Pages.find(selector).remove();
}