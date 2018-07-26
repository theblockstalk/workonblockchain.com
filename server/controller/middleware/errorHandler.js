const logger = require('../services/logger');
const uuidv1 = require('uuid/v1');

exports.handleError = function handleError(err, req, res, next) {
    const requestID = uuidv1();

    let bug = {
        stack: err.stack,
        url: req.url,
        method: req.method,
        requestID: requestID
    };

    logger.error(err.message, bug);

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
