const mongoSanitize = require('mongo-sanitize');
const xssSanitize = require('sanitizer');
const sanitizeHtmlRepo = require('sanitize-html');

module.exports.recursivelySanitize = function recursivelySanitize(obj) {
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
};

module.exports.sanitizeHtml = function sanitizeHtml(htmlString) {
    return sanitizeHtmlRepo(htmlString);
}