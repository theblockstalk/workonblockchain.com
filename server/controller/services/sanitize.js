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

module.exports.sanitizeHtml = function sanitizeHtml(htmlString, options) {
    let htmlOptions;
    if(options === true) {
        htmlOptions = {
            allowedTags: ['u', 'b' , 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'p', 'a', 'ul', 'ol',
                'nl', 'li', 'i', 'strong', 'em', 'strike', 'code', 'hr', 'br', 'div',
                'table', 'thead', 'caption', 'tbody', 'tr', 'th', 'td', 'pre', 'iframe'],
            allowedStyles: {
                '*': {
                    // Match HEX and RGB
                    'text-align': [/^left$/, /^right$/, /^center$/],
                    // Match any number with px, em, or %
                    'font-size': [/^\d+(?:px|em|%)$/]
                }
            }
        }
    }
    return sanitizeHtmlRepo(htmlString, htmlOptions);
}