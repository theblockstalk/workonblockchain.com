const mongoSanitize = require('mongo-sanitize');
const xssSanitize = require('sanitizer');

function recursivelySanitize(obj) {
    if (obj instanceof Object) {
        mongoSanitize(obj);
        for (let key in obj) {
            obj[key] = recursivelySanitize(obj[key]);
        }
        return obj;
    } else {
        if (typeof obj === 'string' || obj instanceof String) {
            return xssSanitize.unescapeEntities(xssSanitize.sanitize(obj));
        } else {
            return obj;
        }
    }
}

function sanitizeMultiple(...objects) {
    for(let obj in objects) {
        recursivelySanitize(obj);
    }
}

function middleware(req, res, next) {
    if (req.body) {
        recursivelySanitize(req.body);
    }
    if (req.params) {
        recursivelySanitize(req.params);
    }
    if (req.query) {
        recursivelySanitize(req.query);
    }
    next();
}

module.exports.recursivelySanitize = recursivelySanitize;
module.exports.sanitizeMultiple = sanitizeMultiple;
module.exports.middleware = middleware;