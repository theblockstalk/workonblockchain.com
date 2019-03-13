const Amplitude = require('amplitude');
const settings = require('../../settings');
const logger = require('./logger');

let amplitude;
if (settings.isLiveApplication()) {
    if (settings.AMPLITUDE.SECRET_API_KEY) {
        amplitude = new Amplitude(settings.AMPLITUDE.API_KEY, { secretKey: settings.AMPLITUDE.SECRET_API_KEY });
    } else {
        amplitude = new Amplitude(settings.AMPLITUDE.API_KEY);
    }
}

module.exports.track = async function (data) {
    if (settings.isLiveApplication()) {
        await new Promise( function(res, rej) {
            try {
                amplitude.track(data).then( function (result) {
                    res(result);
                }).catch( function (error) {
                    logger.error("Amplitude error", {error: error});
                    res();
                })
            } catch (error) {
                rej(error);
            }
        })
    }
}

module.exports.identify = async function (data) {
    // amplitude.identify(data)
}

// module.exports.userSearch =

// module.exports.userActivity =