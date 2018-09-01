const emails = require('../emails');
const settings = require('../../../../settings');

module.exports.sendEmail = function sendEmail(email,name) {
	console.log("candidate approved email");
	console.log(email);
	console.log(name);
    const sendTo = {
        email:email
    };
    const subject = "Account Approve";

    const sendToArray = [sendTo];

    const mandrillOptions = {
        templateName: "wob-candidate-approved",
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