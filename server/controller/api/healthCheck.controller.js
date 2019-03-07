const version = require('../../config/version.json').version;
const errors = require('../services/errors');
const amplitude = require('../services/amplitude');

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
        session_id: new Date().getTime(), // need to replace with their jwt token identifier or something...
        event_properties: {
            name: "jack",
            location: "amsterdam",
            subproperty: {
                subname: "tanner",
                sublocation: "sur"
            },
            array: ["val1", "val2"],
            subarray: [
                { fruit: "apple" },
                { fruit: "orange"}
            ]
        },
        // user_properties: {
        //     //...
        // }
    };
    amplitude.track(amplitudeData)
    //     .then( (result) => {
    //     console.log(result);
    //
    // }).catch( (error) => {
    //     console.log(error)
    //     res.json({
    //         success: true,
    //         message: "this is a health check for the API",
    //         version: version
    //     });
    // })
    res.json({
        success: true,
        message: "this is a health check for the API",
        version: version
    });
};