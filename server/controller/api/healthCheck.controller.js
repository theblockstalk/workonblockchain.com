const version = require('../../config/version.json').version;

module.exports = function healthCheck(req, res) {
   res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
}