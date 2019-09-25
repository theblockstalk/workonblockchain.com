const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(companyName,companyCountry,docLink,userId) {
    const sendTo = {
        email: 'privacy@workonblockchain.com'
    };
    const companyAdminUrl = settings.CLIENT.URL + 'admins/company/'+userId;
    const subject = "DTA document from WOB";
    const sendToArray = [sendTo];
    const sendGridOptions = {
        templateId: "d-c7eec23fe534423d9e4282e179559863",
        subject: subject,
        personalizations: [{
            to: {
                email: 'privacy@workonblockchain.com'
            }
        }],
        templateData: {
            companyName: companyName,
            companyCountry: companyCountry,
            docLink: docLink,
            companyAdminUrl: companyAdminUrl,
            environment: settings.ENVIRONMENT
        }
    };

    emails.sendEmail(sendGridOptions, false);
}