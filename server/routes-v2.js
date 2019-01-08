const express = require('express');
const router = express.Router();
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const endpoints = [
    require('./controller/api-v2/messages/post.controller')
];

const register = function(endpoint) {
    const path = '/v2' + endpoint.request.path;
    router[endpoint.request.type](path,
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