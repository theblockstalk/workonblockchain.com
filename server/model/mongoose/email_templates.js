let Templates = require('../email_templates');

module.exports.insert = async function insert(data) {
    let newDoc = new Templates(data);

    await newDoc.save();

    return newDoc._doc;
}
module.exports.find = async function find(selector) {
    return await Templates.find(selector).lean();
}
module.exports.findOne = async function findOne(selector) {
    return await Templates.findOne(selector).lean();
}

module.exports.findOneAndSort = async function findOne(selector) {
    return await Templates.findOne(selector).sort({updated_date : -1}).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Templates.findById(id).lean();
}


module.exports.update = async function update(selector, updateObj) {
    await Templates.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Templates.find(selector).remove();
}