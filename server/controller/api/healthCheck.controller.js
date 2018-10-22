const version = require('../../config/version.json').version;

module.exports = function healthCheck(req, res) {
    throw new Error("This is my error");
    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
}