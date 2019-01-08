const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const endpoints = [
    require('./controller/api-v2/messages/post.controller')
];

const validateInputs = function(inputSchemas) {
    console.log('in validating inputs');
    const validationTypes = ['query', 'params', 'body'];

    return function (req, res, next) {
        console.log('in schema validation')
        for (const type of validationTypes) {
            const schema = inputSchemas[type];
            if (schema) {
                const input = req[type];
                if (input) {
                    const doc = new mongoose.Document(input, schema);
                    const errors = doc.validateSync();
                    if (errors) throw new Error(JSON.stringify(errors));
                }
            }
        }
        next();
    }
};

const register = function(endpoint) {
    const path = '/v2' + endpoint.request.path;
    router[endpoint.request.type](path,
        asyncMiddleware(validateInputs(endpoint.inputValidation)),
        asyncMiddleware.thenNext(endpoint.auth),
        asyncMiddleware(endpoint.endpoint)
    );
};

const registerEndpoint = function() {
    for (const endpoint of endpoints) {
        register(endpoint);
    }
};

registerEndpoint();
module.exports = router;