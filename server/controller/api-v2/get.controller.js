const Schema = require('mongoose').Schema;
const version = require('../../config/version.json').version;
const errors = require('../services/errors');
const logger = require('../services/logger');

module.exports.request = {
    type: 'get',
    path: '/healthCheck'
};

const querySchema = new Schema({
    error: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.endpoint = async function (req, res) {
    logger.debug("Health check request: ", req);
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
}