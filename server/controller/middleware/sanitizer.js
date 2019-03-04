const sanitize = require('../services/sanitize');
const objects = require('../services/objects');


module.exports.middleware = function middleware(req, res, next) {
    if (req.body) {
        req.unsanitizedBody = objects.copyObject(req.body);
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