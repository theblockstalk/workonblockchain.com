const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = data.referred_fname + ' has created a profile on Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('referred email: ' , data.email);
    let merge_tags;
    if(data.name !== null) {
        merge_tags = [{
            "name": "FNAME",
            "content": data.fname
        }, {
            "name": "FNAME_REFERRED",
            "content": data.referred_fname
        },	{
            "name": "LNAME_REFERRED",
            "content": data.referred_lname
        }]
    } else {
        merge_tags = [{
            "name": "FNAME_REFERRED",
            "content": data.referred_fname
        },	{
            "name": "LNAME_REFERRED",
            "content": data.referred_lname
        }]
    }

    const mandrillOptions = {
        templateName: "wob-you-referred-a-user",
        message: {
            global_merge_vars: merge_tags,
            subject: subject,
            to: sendToArray
        }
    };

    const sendGridOptions = {
        templateId: "d-5dda716352e64894800aea39a236ec81",
        subject: subject,
        personalizations: [{
            to: {
                email: data.email,
                name: data.fname
            }
        }],
        templateData: {
            firstName: data.fname,
            firstNameReferred: data.FNAME_REFERRED,
            lastNameReferred: data.LNAME_REFERRED
        }
    };

    emails.sendEmail(mandrillOptions, sendGridOptions, isAccountDisabed);
}