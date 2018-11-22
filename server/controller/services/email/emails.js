const sendGrid = require('./sendGrid');

module.exports.sendEmail = function sendEmail(mandrillOptions, sendGridOptions, isAccountDisabed) {
    if (!isAccountDisabed) {
    	sendGrid.sendEmail(sendGridOptions);
    }
};