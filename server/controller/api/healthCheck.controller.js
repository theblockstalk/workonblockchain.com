const version = require('../../config/version.json').version;
const errors = require('../services/errors');
const amplitudeData = require('../services/amplitude');

module.exports = function (req, res) {
    if (req.query && req.query.error) {
        if (req.query.raw) {
            throw new Error("I am a normal error")
        } else {
            errors.throwError("I am an application error", 400);
        }
    }

    const amplitudeData = {
        event_type: 'GET /',
        user_id: '1234',
        session_id: new Date().getTime(),
        event_properties: {
            //...
        },
        // user_properties: {
        //     //...
        // }
    };
    amplitude.track(amplitudeData)

    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
};