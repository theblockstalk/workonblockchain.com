const version = require('../../config/version.json').version;

module.exports = function healthCheck(req, res) {
    if (req.query && req.query.error) {
        throw new Error("I am an error!");
    }
    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
};