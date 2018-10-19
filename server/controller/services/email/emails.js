const mandrill = require('./mandrill');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(mandrillOptions, isAccountDisabed) {
    if (settings.isLiveApplication() && !isAccountDisabed) {
    	mandrill.sendEmail(mandrillOptions);
    }
}