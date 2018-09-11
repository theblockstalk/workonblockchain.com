const mandrill = require('./mandrill');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(mandrillOptions) {
    if (settings.isLiveApplication()) {
    	logger.debug('email js mandril options: ' + JSON.stringify(mandrillOptions, null, 2));
        mandrill.sendEmail(mandrillOptions);
    }
}