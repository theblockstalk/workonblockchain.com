const settings = require('../../settings');

let logger = {};

logger.error = function error(...messages) {
    console.log('ERROR:',  messages);
}

logger.debug = function debug(...messages) {
    if (settings.ENVIRONMENT !== 'production') {
        console.log('DEBUG:',  messages);
    }
}

logger.info = function info(...messages) {
    console.log('INFO:',  messages);
}

module.exports = logger;