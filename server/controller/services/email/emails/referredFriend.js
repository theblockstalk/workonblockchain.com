const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    console.log(data);
    const sendTo = {
        email: data.info.email
    };
    const subject = data.info.referred_fname + ' has created a profile on Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('refeered email: ' , data.info.email);
    logger.debug('refeered email: ' , data.info.email);
    const mandrillOptions = {
        templateName: "wob-you-referred-a-user",
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

	emails.sendEmail(mandrillOptions,isAccountDisabed);
}