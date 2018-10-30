const version = require('../../config/version.json').version;
const errors = require('../services/errors');

module.exports = function healthCheck(req, res) {
    if (req.query && req.query.error) {
        if (req.query.raw) {
            throw new Error("I am a normal error")
        } else {
            errors.throwError("I am an application error", 400);
        }
    }
    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
};