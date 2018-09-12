const mandrill = require('./mandrill');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(mandrillOptions) {
    if (settings.isLiveApplication()) {
    	mandrill.sendEmail(mandrillOptions);
    }
}