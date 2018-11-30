const logger = require('../services/logger');

module.exports = function (req, res, next) {

    if (req.body.password) delete req.body.password;

    let log = {
        url: req.url,
        method: req.method,
        body: req.body,
        params: req.params,
        query: req.query
    };
    if (req.auth && req.auth.user.id) log.user_id = req.auth.user.id;
    logger.debug("Request to express API", log);

    next();
};