const settings = require('../../../settings');
const mandrill = require('mandrill-api/mandrill');
const logger = require('../logger');

module.exports.sendEmail = function sendEmail(mandrillOptions) {
    mandrillOptions.message.from_email = settings.MANDRILL.FROM_ADDRESS;
    mandrillOptions.message.from_name = settings.MANDRILL.FROM_NAME;
    mandrillOptions.message.merge_language = "mailchimp";

    mandrillSendTemplate(mandrillOptions.templateName, mandrillOptions.message)
};

function mandrillSendTemplate(templateName, message) {
    let mandrill_client = new mandrill.Mandrill(settings.MANDRILL.API_KEY);

    const templateDetails = {
        "template_name": templateName,
        "template_content": [],
        "message": message,
        "async": true,
        "ip_pool": "Main Pool"
    };

    logger.debug('Sending email with mandrill', {templateDetails: templateDetails});
    mandrill_client.messages.sendTemplate(templateDetails, function(result) {
        if(result[0].status !== 'sent') {
            logger.error('Status is not sent for email', {
                recipients: message.to,
                status: result[0].status,
                template: templateName,
                mandrillId: result[0]._id
                reason: result[0].reject_reason

            });
        } else {
            logger.debug('Email was sent', {recipients: message.to})
        }
    }, function(error) {
        logger.debug('A mandrill error occurred', {
            recipients: message.to,
            template: templateName,
            name: error.name,
            message: error.message
        });
    });
}