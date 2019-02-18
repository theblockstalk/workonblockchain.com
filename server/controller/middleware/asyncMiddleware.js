module.exports = function(fn) {
    if (fn instanceof Function) {
        return function (req, res, next) {
            Promise.resolve(fn(req, res, next)).catch(next);
        }
    }

};

module.exports.thenNext = function thenNext(fn) {
    if (fn instanceof Function) {
        return function (req, res, next) {
            Promise.resolve(fn(req, res, next)).catch(next).then(next);
        }
    }
    else {
        return function (req, res, next) {
            next();
        }
    }

};