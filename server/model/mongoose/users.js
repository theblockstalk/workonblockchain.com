let User = require('../users');

module.exports.insert = async function insert(data) {
    let newDoc = new User(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await User.findOne(selector).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await User.findById(id).lean();
}

module.exports.findOneByEmail = async function findOneByEmail(email) {
    return await User.findOne({email: email}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await User.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await User.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            User.count(selector, (err1, result) => {
                if (err1) reject(err1);
                resolve(result);
            })
        } catch (err2) {
            reject(err2);
        }
    })
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await User.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}