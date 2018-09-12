const mongoSanitize = require('mongo-sanitize');
const xssSanitize = require('sanitizer');
const sanitizeHtmlRepo = require('sanitize-html');

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}

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

function sanitizeHtml(htmlString) {
    return sanitizeHtmlRepo(htmlString);
}

function middleware(req, res, next) {
    if (req.body) {
        req.unsanitizedBody = copyObject(req.body);
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
module.exports.sanitizeHtml = sanitizeHtml;
module.exports.middleware = middleware;