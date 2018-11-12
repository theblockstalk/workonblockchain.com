const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');
// const sgClient = require('@sendgrid/client');

sgMail.setApiKey(settings.SENDGRID.API_KEY);

module.exports.sendEmail = async function sendEmail(sendGridOptions) {
    // console.log(sendGridOptions.personalizations);
    console.log(settings.SENDGRID.API_KEY);
    const msg = {
        personalizations: sendGridOptions.personalizations,
        // to: sendGridOptions.personalizations.to.email,
        from: settings.SENDGRID.FROM_NAME,
        subject: sendGridOptions.subject,
        text: 'and easy to do anywhere, even with Node.js',
        html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        // templateId: sendGridOptions.templateId,
        // dynamic_template_data: sendGridOptions.templateData
    };

    try {
        const response = await sgMail.send(msg);
        console.log('response: ', response);
        // logger.debug(response);
    } catch (error) {
        console.log('error:', error)
        console.log('error.response.body: ', error.response.body)
        // logger.error(error);
    }
}