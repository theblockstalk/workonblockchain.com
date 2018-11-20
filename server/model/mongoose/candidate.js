let Candidate = require('../candidate_profile');

module.exports.insert = async function insert(data) {
    let newDoc = new Candidate(data);

    await newDoc.save();

    return newDoc._doc._id;
}

module.exports.findOne = async function findOne(selector) {
    return await Candidate.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Candidate.findById(id).lean();
}

module.exports.findOneByUserId = async function findOneByUserId(id) {
    return await Candidate.findOne({_creator: id}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Candidate.findOneAndUpdate(selector, updateObj);
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Candidate.find(selector).remove();
}

module.exports.count = async function count(selector) {
    await Candidate.find(selector).count();
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Candidate.find(selector).cursor();
}