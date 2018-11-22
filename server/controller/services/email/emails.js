const sendGrid = require('./sendGrid');
const settings = require('../../../settings');
const logger = require('../logger');

module.exports.sendEmail = function sendEmail(mandrillOptions, sendGridOptions, isAccountDisabed) {
    logger.debug("Sending email", {
        sendGridOptions: sendGridOptions,
        isAccountDisabed: isAccountDisabed
    });
    if (settings.isLiveApplication() && !isAccountDisabed) {
    	sendGrid.sendEmail(sendGridOptions);
    }
};