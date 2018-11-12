const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(settings.SENDGRID.API_KEY);

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
        const errorLog = {
            message: error.message,
            code: error.code,
            // response: error.response,
            errors: error.response.body.errors
        };
        console.log('There was an error sending the message to ' + sendGridOptions.personalizations[0].to.email, errorLog)
        // logger.error('There was an error sending the message to ' + sendGridOptions.personalizations[0].to.email, errorLog);
    }
}