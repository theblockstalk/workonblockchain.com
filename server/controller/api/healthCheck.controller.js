const version = require('../../config/version.json').version;
const errors = require('../services/errors');

module.exports = function healthCheck(req, res) {
    if (req.query && req.query.error) {
        errors.throwError("I am an error", 400);
    }
    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
};