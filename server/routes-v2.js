const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');
const sanitizer = require('./controller/middleware/sanitizer');
const objects = require('./controller/services/objects');
const amplitude = require('./controller/services/amplitude');

const endpoints = [
    require('./controller/api-v2/messages/post.controller'),
    require('./controller/api-v2/messages/get.controller'),
    require('./controller/api-v2/conversations/get.controller'),
    require('./controller/api-v2/conversations/messages/get.controller'),
    require('./controller/api-v2/conversations/messages/patch.controller'),
    require('./controller/api-v2/subscribers/post.controller'),
    require('./controller/api-v2/users/companies/patch.controller'),
    require('./controller/api-v2/crons/get.controller'),
];

const validateInputs = function(request, inputSchemas) {
    console.log('in validating inputs');
    const validationTypes = ['query', 'params', 'body'];
    const modelName = request.type.toUpperCase() + request.path;
    const models = {
        'query': inputSchemas.query ? mongoose.model(modelName + "-query", inputSchemas.query) : null,
        'params': inputSchemas.params ? mongoose.model(modelName + "-params", inputSchemas.params) : null,
        'body': inputSchemas.body ? mongoose.model(modelName + "-body", inputSchemas.body) : null
    };

    return function (req) {
        for (const type of validationTypes) {
            const input = req[type];
            if (input && !objects.isEmpty(input)) {
                console.log('validating ' + type, input);
                const doc = new models[type](input);
                const error = doc.validateSync();
                if (error) throw new Error(error);
            }
        }
    }
};

const amplitudeTrack = function (request) {
    let data = {
        event_properties: {}
    };

    function convertToken(token) {
        console.log(token);
        return 1234;
    }

    return function (req) {
        if (req.auth.user) {
            data.user_id = req.auth.user._id.toString();
        } else {
            data.user_id = "anonimous"
        }
        if (req.headers && req.headers.authorization) {
            const token = req.headers.authorization;
            data.session_id = token;
        }
        if (req.query) data.event_properties.query = req.query;
        if (req.body) data.event_properties.body = req.body;
        if (req.query) data.event_properties.params = req.params;
        amplitude.track(data);
    }
};

const register = function(endpoint) {
    const path = '/v2' + endpoint.request.path;
    router[endpoint.request.type](path,
        asyncMiddleware.thenNext(endpoint.files),
        sanitizer.middleware,
        asyncMiddleware.thenNext(validateInputs(endpoint.request, endpoint.inputValidation)),
        asyncMiddleware.thenNext(endpoint.auth),
        asyncMiddleware.thenNext(amplitudeTrack(endpoint.request)),
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