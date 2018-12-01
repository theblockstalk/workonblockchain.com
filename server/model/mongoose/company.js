let Company = require('../employer_profile');

module.exports.insert = async function insert(data) {
    let newDoc = new Company(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Company.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Company.findById(id).lean();
}

module.exports.findOneByUserId = async function findOneByUserId(id) {
    return await Company.findOne({_creator: id}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Company.findOneAndUpdate(selector, updateObj);
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Company.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            Candidate.count(selector, (err1, result) => {
                if (err1) reject(err1);
                resolve(result);
            })
        } catch (err2) {
            reject(err2);
        }
    })
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Company.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}