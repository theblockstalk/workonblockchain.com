const express = require('express');
const router = express.Router();
const auth = require('./controller/middleware/auth');
const asyncMiddleware = require('./controller/middleware/asyncMiddleware');

const healthCheck = require('./controller/api/healthCheck.controller');

// Chat
const updateExplanationPopupStatus = require('./controller/api/chat/updateExplanationPopupStatus.controller');

// Admin
const adminGetMetrics = require('./controller/api/users/admins/getMetrics.controller');

// statistics
const getStatistics = require('./controller/api/users/statistics.controller');

router.get('/', healthCheck);

// Chat
router.post('/users/updatePopupStatus', auth.isLoggedIn, asyncMiddleware(updateExplanationPopupStatus));

// Admin
router.get('/users/get_metrics', auth.isAdmin, asyncMiddleware(adminGetMetrics));

// statistics
router.get('/users/statistics' , asyncMiddleware(getStatistics)); // will be deleted after discuss with Jack

module.exports = router;