const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(companyName, docLink, firstName) {

    const sendTo = {
        email: 'privacy@workonblockchain.com'
    };
    const subject = "DTA document from WOB";

    const sendToArray = [sendTo];

    const sendGridOptions = {
        templateId: "d-4564d4d9fec8469c8dfe0298511e8e17", //will be changed, ask Jack about this
        subject: subject,
        personalizations: [{
            to: {
                email: 'privacy@workonblockchain.com',
                name: firstName //may be removed, ask Jack about this
            }
        }],
        templateData: {
            companyName: companyName,
            docLink: docLink
        }
    };

    emails.sendEmail(sendGridOptions, false);
}