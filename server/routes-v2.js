const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const endpoints = [
    require('./controller/api-v2/messages/post.controller')
];

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

const validateInputs = function(inputSchemas) {
    console.log('in validating inputs');
    const validationTypes = ['query', 'params', 'body'];

    return function (req) {
        for (const type of validationTypes) {
            const input = req[type];
            if (input && !isEmpty(input)) {
                console.log('validating ' + type, input);
                const schema = inputSchemas[type];
                const model = mongoose.model(type + Date.now().toString(), schema)
                const doc = new model(input);
                const error = doc.validateSync();
                if (error) throw new Error(error);
            }
        }
    }
};

const register = function(endpoint) {
    const path = '/v2' + endpoint.request.path;
    router[endpoint.request.type](path,
        asyncMiddleware.thenNext(validateInputs(endpoint.inputValidation)),
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