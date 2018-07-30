const express = require('express');
const router = express.Router();

router.get('/' , healthCheck);

module.exports = router;

function healthCheck(req, res) {
   res.json({
        success: true,
        message: "this is a health check for the API"
    });
}