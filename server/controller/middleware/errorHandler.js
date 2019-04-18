const logger = require('../services/logger');
const uuidv1 = require('uuid/v1');
const { ApplicationError } = require('../services/errors');

module.exports = function middleware(err, req, res, next) {
    logger.debug("Error handler check request object 1: " , req);
    const requestID = uuidv1();

    let bug = {
        stack: err.stack,
        url: req.url,
        method: req.method,
        code: err.code,
        requestID: requestID,
        request: {}
    };
    logger.debug("Error handler check request object 2: ", req);
    if (req.params) bug.request.params = req.params;
    if (req.query) bug.request.params = req.query;
    if (req.body) {
        if (req.body.password) delete req.body.password;
        bug.request.body = req.body;
    }
    logger.debug("Error handler check bug object: ", bug);
    if(err instanceof ApplicationError) {
        logger.warn(err.message, bug);
    } else {
        logger.error(err.message, bug);
    }

    const responseData = {
        message: err.message,
        requestID: requestID,
        success: false
    };

    if(err.code >= 400 && err.code <= 418) {
        res.status(err.code);
    } else {
        res.status(500);
    }
    res.send(responseData);
};
