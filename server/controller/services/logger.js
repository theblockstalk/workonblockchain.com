const settings = require('../../settings');

let logger;

logger.error(...messages) {
    console.log('ERROR:',  messages);
}

logger.debug(...message) {
    if (settings.ENVIRONMENT !== 'production') {
        console.log('DEBUG:',  messages);
    }
}

logger.info(...message) {
    console.log('INFO:',  messages);
}

module.exports = logger;