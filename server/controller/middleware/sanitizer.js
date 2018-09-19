const sanitize = require('../services/sanitize');

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

module.exports.middleware = function middleware(req, res, next) {
    if (req.body) {
        req.unsanitizedBody = copyObject(req.body);
        sanitize.recursivelySanitize(req.body);
    }
    if (req.params) {
        sanitize.recursivelySanitize(req.params);
    }
    if (req.query) {
        sanitize.recursivelySanitize(req.query);
    }
    next();
}