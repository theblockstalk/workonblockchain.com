const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

if (settings.isLiveApplication()) {
    sgMail.setApiKey(settings.SENDGRID.API_KEY);
}

module.exports.sendEmail = async function sendEmail(sendGridOptions) {
    const msg = {
        personalizations: sendGridOptions.personalizations,
        from: {
            email: settings.SENDGRID.FROM_ADDRESS,
            name: settings.SENDGRID.FROM_NAME
        },
        subject: sendGridOptions.subject,
        templateId: sendGridOptions.templateId,
        dynamic_template_data: sendGridOptions.templateData
    };

    logger.debug('Sending message with Sendgrid', msg);

    try {
        await sgMail.send(msg);
        logger.debug('Sucessfully sent to ' + sendGridOptions.personalizations[0].to.email);
    } catch (error) {
        logger.error('There was an error sending the message to ' + sendGridOptions.personalizations[0].to.email, error);
    }
}

module.exports.getAllLists = async function getAllLists() {
    let request = {
        method: 'GET',
        url: '/v3/contactdb/lists'
    };

    let response = await sgClient.request(request);
    if (response.statusCode !== 200) {
        logger.error("Sendgrid API request failed", {
            request: request,
            response: response
        })
    } else {
        return response.body;
    }
}