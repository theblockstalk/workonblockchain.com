const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;
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
    require('./controller/api-v2/users/auth/delete.controller'),
    require('./controller/api-v2/users/auth/password/put.controller'),
    require('./controller/api-v2/users/auth/password/reset/post.controller'),
    require('./controller/api-v2/users/auth/password/reset/put.controller'),
    require('./controller/api-v2/users/email/patch.controller'),
    require('./controller/api-v2/users/email/post.controller'),
    require('./controller/api-v2/referral/get.controller'),
    require('./controller/api-v2/referral/post.controller'),
    require('./controller/api-v2/users/companies/get.controller'),
    require('./controller/api-v2/users/companies/search/post.controller'),
    require('./controller/api-v2/users/candidates/search/post.controller'),
    require('./controller/api-v2/referral/email/post.controller'),
    require('./controller/api-v2/users/patch.controller'),
    require('./controller/api-v2/health/get.controller')
];

const validateInputs = function(request, inputSchemas) {
    if (inputSchemas) {
        console.log('in validating inputs');
        const validationTypes = ['query', 'params', 'body'];
        const modelName = request.type.toUpperCase() + request.path;
        const models = {
            'query': inputSchemas.query ? mongoose.model(modelName + "-query", inputSchemas.query) : null,
            'params': inputSchemas.params ? mongoose.model(modelName + "-params", inputSchemas.params) : null,
            'body': inputSchemas.body ? mongoose.model(modelName + "-body", inputSchemas.body) : null
        };

        const checkForUnwantedProperties = function (obj, schema) {
            let schemaObj;
            if (obj instanceof Array) {
                // schemaObj = schema.type[0];
                if(schema.type) schemaObj = schema.type[0];
                else schemaObj = schema[0];
                for (let val of obj) {
                    checkForUnwantedProperties(val, schemaObj)
                }
            } else if (obj instanceof Object) {
                if (schema instanceof Schema) {
                    schemaObj = schema.obj;

                    for (let key in obj) {
                        if (key !== '_id' && !schemaObj[key]) throw new Error('Key ' + key + ' could not be found in schema ' + JSON.stringify(schemaObj))
                        checkForUnwantedProperties(obj[key], schemaObj[key]);
                    }
                } else {
                    schemaObj = schema;
                    let schemaObject;
                    for (let key in obj) {
                        if(schemaObj[key] && schemaObj[key].type) schemaObject = schemaObj[key].type;
                        else schemaObject = schemaObj[key];
                        if (!schemaObj[key]) throw new Error('Key ' + key + ' could not be found in schema ' + JSON.stringify(schemaObj))
                        checkForUnwantedProperties(obj[key], schemaObject);
                    }
                }
            }
        };

        const validateObject = function (input, type) {
            // check object matches schema
            const doc = new models[type](input);
            const error = doc.validateSync();
            if (error) throw new Error(error);

            // check object does not contain any other properties
            checkForUnwantedProperties(input, inputSchemas[type]);
        };

        return function (req) {
            for (const type of validationTypes) {
                const input = req[type];
                if (input && !objects.isEmpty(input)) {
                    validateObject(input, type)
                }
            }
        }
    }
};

const amplitudeTrack = function (request) {
    let data = {
        event_type: request.path + ' - ' + request.type.toUpperCase(),
        event_properties: {}
    };

    if (request.path === '/') {
        return function (req) {
            return;
        }
    } else {
        return function (req) {
            if (req.auth && req.auth.user) {
                data.user_id = req.auth.user._id.toString();
                data.session_id = req.auth.user.session_started.getTime();
            } else {
                data.user_id = "anonimous"
                data.session_id = -1;
            }
            if (req.query && !objects.isEmpty(req.query)) data.event_properties.query = req.query;
            if (req.body && !objects.isEmpty(req.body)) {
                data.event_properties.body = objects.copyAndFlattenArrays(req.body);
                delete data.event_properties.body.password;
            }
            if (req.params && !objects.isEmpty(req.params)) data.event_properties.params = req.params;
            amplitude.track(data);
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