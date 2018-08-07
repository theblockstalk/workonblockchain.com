module.exports = function healthCheck(req, res) {
   res.json({
        success: true,
        message: "this is a health check for the API"
    });
}