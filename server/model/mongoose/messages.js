let Messages = require('../messages');

module.exports.insert = async function insert(data) {
    let newDoc = new Messages(data);

    await newDoc.save();

    return newDoc._doc;
}