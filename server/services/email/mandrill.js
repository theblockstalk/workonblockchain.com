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

    mandrillSendTemplate(mandrillOptions.templateName, mandrillOptions.message)
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

    console.log('Sending email with mandrill: ', JSON.stringify(templateDetails, null, 2));

    mandrill_client.messages.sendTemplate(templateDetails, function(result) {
        if(result[0].status !== 'sent') {
            console.log('Status is not sent for email to : \nEmail: ' + JSON.stringify(message.to))
            console.log("Status: " + result[0].status + "\nTemplate : " + templateName + '\nMandrill ID : ' + result[0]._id + '\nReason : ' + result[0].reject_reason);
        } else {
            console.log('Email was sent to ', message.to)
        }
    }, function(error) {
        console.log('A mandrill error occurred: ' + error.name + ' - ' + error.message);
        console.log('Unable to send email to \nEmail: ' + message.to + "\nTemplate : " + templateName);

    });
}