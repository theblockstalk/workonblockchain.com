const emails = require('../emails');

module.exports.sendEmail = function sendEmail(data) {

    const sendTo = {
        email: data.info.email,
        name: "NAME OF RECIPIENT - NEED TO ADD THIS!!!"
    };
    const subject = data.info.referred_fname + ' has created a profile on Work on Blockchain!';

    /*const nodemonOptions = {
        from: 'workonblockchain@mwancloud.com', // sender address
        to : data.info.email,//sendTo.email,
        subject: subject,
        text : data.body,
        html : '<p>Hi '+data.info.fname+'</p> <br/><p>Great news!</p><br/><p>  You have referred '+data.info.referred_fname+' '+data.info.referred_lname+' to Work on Blockchain and they have created a profile. When this person is hired through the platform you will be rewarded with £500 (please see the FAQs for more details)! </p> <br/><p>We will notify you if and when this happens.</p><br/><p>Thanks,</p><br/><p> Work on Blockchain team!</p>'
    };*/

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

    //emails.sendEmail(nodemonOptions, mandrillOptions);
	emails.sendEmail(mandrillOptions);
}