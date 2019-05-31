const express = require('express');
const router = express.Router();
const auth = require('./controller/middleware/auth');
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

module.exports = router;