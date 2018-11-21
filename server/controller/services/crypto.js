const crypto = require('crypto');

module.exports.getRandomString = function(length) {
    if (length >= 128) throw new Error("Length must be less than 128 characters");

    let randomString = crypto.randomBytes(16).toString('base64');
    return randomString.substr(1, length);
}