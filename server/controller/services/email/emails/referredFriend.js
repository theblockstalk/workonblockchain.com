const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {
	console.log("referred friend");
	console.log(data.info.email);
    const sendTo = {
        email: data.info.email
    };
    const subject = data.info.referred_fname + ' has created a profile on Work on Blockchain!';

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-you-referred-a-friend",
        message: {
            global_merge_vars: [{
                "name": "FNAME",
                "content": data.info.fname
            }, {
                "name": "FNAME_REFERRED",
                "content": data.info.referred_fname
            },	{
                "name": "LNAME_REFERRED",
                "content": data.info.referred_lname
            }],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}