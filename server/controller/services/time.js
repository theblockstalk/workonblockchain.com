module.exports.now = function now() {
    return Date.now();
};

exports.exports.createTimestamp = function createTimestamp() {
    return Math.floor(Date.now() / 1000);
};