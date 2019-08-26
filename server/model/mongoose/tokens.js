let Tokens = require('../tokens');

module.exports.insert = async function insert(data) {
    let newDoc = new Tokens(data);

    await newDoc.save();

    return newDoc._doc;
}

module.exports.findOne = async function (selector) {
    return await Tokens.findOne(selector).lean();
}

module.exports.findOneById = async function (id) {
    return await Tokens.findById(id).lean();
}

module.exports.findOneByType = async function (type) {
    return await Tokens.findOne({token_type: type}).lean();
}

module.exports.updateOne = async function (selector, updateObj) {
    await Tokens.findOneAndUpdate(selector, updateObj, { runValidators: true });
}

module.exports.deleteOne = async function (selector) {
    await Tokens.find(selector).remove();
}

module.exports.count = async function (selector) {
    return new Promise((resolve, reject) => {
        try {
            Tokens.count(selector, (err1, result) => {
            if (err1) reject(err1);
            resolve(result);
        })
        } catch (err2) {
            reject(err2);
        }
    })
}