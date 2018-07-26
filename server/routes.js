const express = require('express');
const router = express.Router();

const healthCheck = require('./controller/healthCheck.controller');
const authenticate = require('./controller/api/users/authenticate.controller');
const users = require('./controller/users.controller');

router.get('/', healthCheck);
router.post('/users/authenticate', authenticate);
router.post('/authenticate', authenticate);

module.exports = router;