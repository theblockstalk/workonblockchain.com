const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = data.referred_fname + ' has created a profile on Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('referred email: ' , data.email);
    let merge_tags, templateData, sendGridTo;
    if(data.name) {
        merge_tags = [{
            "name": "FNAME",
            "content": data.fname
        }, {
            "name": "FNAME_REFERRED",
            "content": data.referred_fname
        }, {
            "name": "LNAME_REFERRED",
            "content": data.referred_lname
        }];
        templateData = {
            firstName: data.fname,
            firstNameReferred: data.referred_fname,
            lastNameReferred: data.referred_lname
        };
        sendGridTo = {
            email: data.email,
            name: data.fname
        }
    } else {
        merge_tags = [{
            "name": "FNAME_REFERRED",
            "content": data.referred_fname
        },	{
            "name": "LNAME_REFERRED",
            "content": data.referred_lname
        }];
        templateData = {
            firstNameReferred: data.referred_fname,
            lastNameReferred: data.referred_lname
        };
        sendGridTo = {
            email: data.email
        }
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
            to: sendGridTo
        }],
        templateData: templateData
    };

    emails.sendEmail(mandrillOptions, sendGridOptions, isAccountDisabed);
}