let Cities = require('../cities');

module.exports.insert = async function insert(data) {
    let newDoc = new Cities(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function findOne(selector) {
    return await Cities.findOne(selector).lean();
}


module.exports.findAndLimit4 = async function findAndLimit4(selector) {
    return await Cities.find(selector).limit(4).lean();
}

module.exports.findOneById = async function findOneById(id) {
    return await Cities.findById(id).lean();
}

module.exports.findOneByEmail = async function findOneByEmail(email) {
    return await Cities.findOne({email: email}).lean();
}

module.exports.update = async function update(selector, updateObj) {
    await Cities.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function deleteOne(selector) {
    await Cities.find(selector).remove();
}

module.exports.count = async function count(selector) {
    return new Promise((resolve, reject) => {
        try {
            Cities.count(selector, (err1, result) => {
            if (err1) reject(err1);
    resolve(result);
})
} catch (err2) {
        reject(err2);
    }
})
}

module.exports.findWithCursor = async function findWithCursor(selector) {
    return await Cities.find(selector).cursor();
}

module.exports.findAndIterate = async function findAndIterate(selector, fn) {
    let cursor = await this.findWithCursor(selector);
    let doc = await cursor.next();

    for (null; doc !== null; doc = await cursor.next()) {
        await fn(doc);
    }
}