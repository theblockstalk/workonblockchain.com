const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = {
        email: data.email
    };
	variableABC = data.body;
	new_message = variableABC.replace(/\n/g, "<br>");  
	console.log(new_message);
    const subject = data.subject;

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [{
                "name": "MESSAGE_BODY",
                "content": new_message
            }],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}