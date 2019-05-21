const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');
const sanitizer = require('./controller/middleware/sanitizer');

const endpoints = [
    require('./controller/api-v2/messages/post.controller'),
    require('./controller/api-v2/messages/get.controller'),
    require('./controller/api-v2/conversations/get.controller'),
    require('./controller/api-v2/conversations/messages/get.controller'),
    require('./controller/api-v2/conversations/messages/patch.controller'),
    require('./controller/api-v2/subscribers/post.controller'),
    require('./controller/api-v2/users/companies/patch.controller'),
    require('./controller/api-v2/crons/get.controller'),
    require('./controller/api-v2/users/candidates/history/post.controller'),
    require('./controller/api-v2/users/candidates/patch.controller'),
    require('./controller/api-v2/users/candidates/post.controller'),
    require('./controller/api-v2/users/auth/post.controller'),
    require('./controller/api-v2/users/companies/status/post.controller'),
    require('./controller/api-v2/users/companies/post.controller'),
    require('./controller/api-v2/users/candidates/get.controller'),
    require('./controller/api-v2/users/settings/patch.controller'),
    require('./controller/api-v2/email_template/post.controller'),
    require('./controller/api-v2/email_template/patch.controller'),
    require('./controller/api-v2/email_template/search/get.controller'),
    require('./controller/api-v2/locations/get.controller'),
    require('./controller/api-v2/pages/post.controller'),
    require('./controller/api-v2/pages/get.controller'),
    require('./controller/api-v2/statistics/get.controller'),
    require('./controller/api-v2/users/auth/delete.controller')
];

function isEmpty(obj) {
    for(let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}

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
            if (input && !isEmpty(input)) {
                console.log('validating ' + type, input);
                const doc = new models[type](input);
                const error = doc.validateSync();
                if (error) throw new Error(error);
            }
        }
    }
};

const register = function(endpoint) {
    const path = '/v2' + endpoint.request.path;
    router[endpoint.request.type](path,
        asyncMiddleware.thenNext(endpoint.files),
        sanitizer.middleware,
        asyncMiddleware.thenNext(validateInputs(endpoint.request, endpoint.inputValidation)),
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