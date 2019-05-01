const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = data.fname_referred + ' has created a profile on Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('referred email: ' , data.email);
    let merge_tags, templateData, sendGridTo;
    if(data.fname) {
        merge_tags = [{
            "name": "FNAME",
            "content": data.fname
        }, {
            "name": "FNAME_REFERRED",
            "content": data.fname_referred
        },	{
            "name": "LNAME_REFERRED",
            "content": data.lname_referred
        },	{
            "name": "COMPANY_NAME",
            "content": data.company_name
        }];
        templateData = {
            firstName: data.fname,
            firstNameReferred: data.fname_referred,
            lastNameReferred: data.lname_referred,
            companyName: data.company_name
        };
        sendGridTo = {
            email: data.email,
            name: data.fname
        }
    } else {
        merge_tags = [{
            "name": "FNAME_REFERRED",
            "content": data.fname_referred
        },	{
            "name": "LNAME_REFERRED",
            "content": data.lname_referred
        },	{
            "name": "COMPANY_NAME",
            "content": data.company_name
        }];
        templateData = {
            firstNameReferred: data.fname_referred,
            lastNameReferred: data.lname_referred,
            companyName: data.company_name
        };
        sendGridTo = {
            email: data.email
        }
    }


    const sendGridOptions = {
        templateId: "d-9743c4863fd0483a859eff80a4d83ca2",
        subject: subject,
        personalizations: [{
            to: sendGridTo
        }],
        templateData: templateData
    };

    emails.sendEmail(sendGridOptions, isAccountDisabed);
};