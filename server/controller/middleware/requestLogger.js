const logger = require('../services/logger');

module.exports = function (req, res, next) {

    let body = copyObject(req.body);
    if (body.password) delete body.password;

    let log = {
        url: req.url,
        method: req.method,
        body: body,
        params: req.params,
        query: req.query
    };
    if (req.auth && req.auth.user.id) log.user_id = req.auth.user.id;
    logger.debug("Request to express API", log);

    next();
};

function copyObject(obj) {
    return JSON.parse(JSON.stringify(obj));
}