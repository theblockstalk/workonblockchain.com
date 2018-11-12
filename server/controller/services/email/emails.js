const mandrill = require('./mandrill');
const sendGrid = require('./sendGrid');
const settings = require('../../../settings');

module.exports.sendEmail = function sendEmail(mandrillOptions, sendGridOptions, isAccountDisabed) {
    if (settings.isLiveApplication() && !isAccountDisabed) {
    	// mandrill.sendEmail(mandrillOptions);
        sendGrid.sendEmail(sendGridOptions);
    }
}