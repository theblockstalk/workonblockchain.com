module.exports = function(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next);
    }
};

module.exports.thenNext = function(fn) {
    return function (req, res, next) {
        Promise.resolve(fn(req, res, next)).catch(next).then(next);
    }
};