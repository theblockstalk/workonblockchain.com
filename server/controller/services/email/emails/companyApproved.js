const emails = require('../emails');
const settings = require('../../../../settings');

module.exports.sendEmail = function sendEmail(email,name) {
	console.log("companyApproved email");
	console.log(email);
	console.log(name);
    const sendTo = {
        email:email
    };
    const subject = "Your account has been approved!";

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-company-approved",
        message: {
        	 global_merge_vars: [{
        	     "name": "FNAME",
                 "content": name
             }],
            subject: subject,
            to: sendToArray
        }
    };

	emails.sendEmail(mandrillOptions);
}