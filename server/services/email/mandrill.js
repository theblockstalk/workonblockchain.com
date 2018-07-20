const settings = require('../settings');
const mandrill = require('mandrill-api/mandrill');

// mandrillOptions = {
//     templateName,
//     message: {
//         global_merge_vars: [],
//         subject,
//         to,
//         from_email,
//         from_name,
//         merge_language
//     },
//
// }
module.exports.sendEmail = function sendEmail(mandrillOptions) {
    mandrillOptions.message.from_email = settings.MANDRILL.FROM_ADDRESS;
    mandrillOptions.message.from_name = settings.MANDRILL.FROM_NAME;
    mandrillOptions.message.merge_language = "mailchimp";

    await mandrillSendTemplate(mandrillOptions.templateName, mandrillOptions.message)
}

function mandrillSendTemplate(templateName, message) {
    let mandrill_client = new mandrill.Mandrill(settings.MANDRILL.API_KEY);

    const templateDetails = {
        "template_name": templateName,
        "template_content": [],
        "message": message,
        "async": true,
        "ip_pool": "Main Pool"
    };

    mandrill_client.messages.sendTemplate(templateDetails, function(result) {
        if(result[0].status !== 'sent') {
            console.log('Status is not sent for email to : \nEmail: ' + message.to
                + "\nTemplate : " + templateName + '\nMandrill ID : ' + result[0]._id
                + 'Reason : ' + result[0].reject_reason);
        }
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        logger.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        logger.error('\nUnable to send email to \nEmail: ' + message.to
            + "\nTemplate : " + templateName);

    });
}