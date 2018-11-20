let User = require('../users');

module.exports.insert = async function insert(userData) {
    let mongooseUser = new User(userData);

    await mongooseUser.save();

    return mongooseUser._doc._id;
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
    await User.findOneAndUpdate(selector, updateObj);
}

module.exports.deleteOne = async function deleteOne(selector) {
    await User.find(selector).remove();
}

module.exports.count = async function count(selector) {
    await User.find(selector).count();
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await User.find(selector).cursor();
}

module.exports.findAndProcess = async function findAndProcess(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}