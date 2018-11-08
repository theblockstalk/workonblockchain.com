const emails = require('../emails');
const logger = require('../../logger');

module.exports.sendEmail = function sendEmail(data,isAccountDisabed) {
    const sendTo = {
        email: data.email
    };
    const subject = data.FNAME_REFERRED + ' has created a profile on Work on Blockchain!';
    const sendToArray = [sendTo];
    logger.debug('referred email: ' , data.email);
    let merge_tags;
    if(data.name !== null)
    {
        merge_tags = [{
            "name": "FNAME",
            "content": data.fname
        }, {
            "name": "FNAME_REFERRED",
            "content": data.FNAME_REFERRED
        },	{
            "name": "LNAME_REFERRED",
            "content": data.LNAME_REFERRED
        },	{
            "name": "COMPANY_NAME",
            "content": data.COMPANY_NAME
        }]


    }

    else
    {
        merge_tags = [{
            "name": "FNAME_REFERRED",
            "content": data.referred_fname
        },	{
            "name": "LNAME_REFERRED",
            "content": data.referred_lname
        },	{
            "name": "COMPANY_NAME",
            "content": data.COMPANY_NAME
        }]

    }
    const mandrillOptions = {
        templateName: "wob-you-referred-a-company",
        message: {
            global_merge_vars: merge_tags,
            subject: subject,
            to: sendToArray
        }
    };

    emails.sendEmail(mandrillOptions,isAccountDisabed);
}