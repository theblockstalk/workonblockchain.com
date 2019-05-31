const express = require('express');
const router = express.Router();
const auth = require('./controller/middleware/auth');
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const healthCheck = require('./controller/api/healthCheck.controller');

// Chat
const updateExplanationPopupStatus = require('./controller/api/chat/updateExplanationPopupStatus.controller');

router.get('/', healthCheck);

// Chat
router.post('/users/updatePopupStatus', auth.isLoggedIn, asyncMiddleware(updateExplanationPopupStatus));

module.exports = router;