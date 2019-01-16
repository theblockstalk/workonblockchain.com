let Messages = require('../messages');

module.exports.insert = async function (data) {
    let newDoc = new Messages(data);
    await newDoc.save();
    return newDoc._doc;
}

module.exports.find = async function (selector) {
    return await Messages.find(selector).lean();
}

module.exports.findOne = async function (selector) {
    return await Messages.findOne(selector).lean();
}

module.exports.findOneById = async function (id) {
    return await Messages.findById(id).lean();
}

module.exports.update = async function (selector, updateObj) {
    await Messages.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function (selector) {
    await Messages.find(selector).remove();
}

module.exports.count = async function (selector) {
    return new Promise ( function (resolve, reject) {
        try {
            Messages.count(selector, function (err1, result) {
                if (err1) reject(err1);
                resolve(result);
            })
        }
        catch (err2) {
            reject(err2);
        }
    })
}

module.exports.findWithCursor = async function (selector) {
    return await Messages.find(selector).cursor();
}

module.exports.findAndIterate = async function (selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}