const settings = require('../settings');
const mandrill = require('mandrill-api/mandrill');

module.exports.sendEmail = function sendEmail(mailOptions, mandrillOptions) {
    // let action = 'WELCOME_EMAIL'
    // let data  = await getTemplateAndMessage(action,email,name);
    // let username_link = "https://indorse.io/" + username;
    // let ref_link  = '<a href="' + username_link + '">' + username_link + '</a>'
    //
    // data.message.global_merge_vars = [
    //     {
    //         "name": "INDORSE_FIRSTNAME",
    //         "content": name
    //     },
    //     {
    //         "name" : "INDORSE_USERNAME",
    //         "content" : ref_link
    //     }
    // ]
    // await sendEmail(data.templateName,data.message,action);

    mandrillOptions.from_email = settings.MANDRILL.FROM_ADDRESS;
    mandrillOptions.from_name = settings.MANDRILL.FROM_NAME;
    mandrillOptions.merge_language = "mailchimp";

    await mandrillEmailSend(mandrillOptions.templateName, mandrillOptions.message)
}

function mandrillEmailSend(templateName, message) {
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
            console.log('Status is not sent for email to : \nEmail: ' + JSON.stringify(message.to)
                + "\nTemplate : " + templateName + '\nMandrill ID : ' + result[0]._id
                + 'Reason : ' + result[0].reject_reason);
        }
    }, function(e) {
        // Mandrill returns the error as an object with name and message keys
        logger.error('A mandrill error occurred: ' + e.name + ' - ' + e.message);
        logger.error('\nUnable to send email to \nEmail: ' + JSON.stringify(message.to) + "\nAction : " + action);

    });
}