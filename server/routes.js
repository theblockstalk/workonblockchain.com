const express = require('express');
const router = express.Router();

const healthCheck = require('./controller/healthCheck.controller');
const users = require('./controller/users.controller');

router.get('/', healthCheck);

module.exports = router;