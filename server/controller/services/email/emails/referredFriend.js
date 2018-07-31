const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {

    const sendTo = {
        email: data.info.email
    };
    const subject = data.info.referred_fname + ' has created a profile on Work on Blockchain!';

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-you-referred-a-friend",
        message: {
            global_merge_vars: [
				{FNAME : data.info.fname},
				{FNAME_REFERRED : data.info.referred_fname},
				{LNAME_REFERRED : data.info.referred_lname}
			],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}