const mandrill = require('./mandrill');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(mandrillOptions) {
    if (settings.isLiveApplication()) {
    	logger.debug('email js mandril options: ' + {obj: mandrillOptions});
        mandrill.sendEmail(mandrillOptions);
    }
}