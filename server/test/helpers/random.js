const crypto = require('crypto');

const string = module.exports.string = function (length = 10) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex')
        .slice(0, length);
};

module.exports.email = function () {
    return string() + '@example.com';
};

module.exports.boolean = function () {
    if (Math.random() > 0.5) {
        return true;
    } else {
        return false;
    }
};

module.exports.integer = function (min = 0, max = 10000) {
    let number = Math.floor((max - min)*Math.random()) - min;
    if(number < -1) number = Math.floor((max - min)*Math.random()) - min;
    return number
};

module.exports.enum = function (enums) {
    const keyNo = Math.floor(Math.random() * enums.length);
    return enums[keyNo];
};