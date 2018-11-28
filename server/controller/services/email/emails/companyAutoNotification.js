const emails = require('../emails');
const settings = require('../../../../settings');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(email,first_name,company_name,candidateList,isAccountDisabed) {
    const sendTo = {
        email:email
    };
    const subject = "New candidates that match your search!";

    const sendGridOptions = {
        templateId: "d-951e44e917e340798954c638f151bf76",
        subject: subject,
        personalizations: [{
            to: {
                email: email,
                name: first_name
            }
        }],
        templateData: {
            firstName: first_name,
            company_name: company_name,
            candidates : candidateList
        }
    };
    logger.debug('Sending email with sendGrid', {templateDetails: sendGridOptions});


    emails.sendEmail(sendGridOptions, isAccountDisabed);
}