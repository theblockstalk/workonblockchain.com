const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = {
        email: data.email
    };
    const subject = data.subject;

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-refer-a-user",
        message: {
            global_merge_vars: [
				{FNAME_REFEREE: data.first_name},
				{LNAME_REFEREE: data.last_name},
				{REFER_INVITATION_URL: data.share_url},
				{MESSAGE_BODY: data.body}
			],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}