const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
    const sendTo = {
        email: data.email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = data.subject;

    /*const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : 'sadiaabbas326@gmail.com',//sendTo.email,
        subject: subject,
        text : data.body,
        html : data.body
    };*/

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

    //emails.sendEmail(nodemonOptions, mandrillOptions);
	emails.sendEmail(mandrillOptions);
}