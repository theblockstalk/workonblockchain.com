const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

// if (settings.isLiveApplication()) {
    logger.debug("Setting Sendgrid API key");
    sgMail.setApiKey(settings.SENDGRID.API_KEY);
    sgClient.setApiKey(settings.SENDGRID.API_KEY);
// }

module.exports.sendEmail = async function sendEmail(sendGridOptions) {
    const msg = {
        personalizations: sendGridOptions.personalizations,
        from: {
            email: settings.SENDGRID.FROM_ADDRESS,
            name: settings.SENDGRID.FROM_NAME
        },
        subject: sendGridOptions.subject,
        templateId: sendGridOptions.templateId,
        dynamic_template_data: sendGridOptions.templateData
    };

    logger.debug('Sending message with Sendgrid', msg);

    try {
        await sgMail.send(msg);
        logger.debug('Sucessfully sent to ' + sendGridOptions.personalizations[0].to.email);
    } catch (error) {
        logger.error('There was an error sending the message to ' + sendGridOptions.personalizations[0].to.email, error);
    }
}

async function apiRequest(request) {
    let response;
    logger.debug('Sendgrid API request', request);

    [response, ] = await sgClient.request(request);

    if (response.statusCode < 200 || response.statusCode >= 300) {
        logger.error("Sendgrid API request failed", response);
        throw new Error();
    }

    return response.body;
}

module.exports.getAllLists = async function getAllLists() {
    const request = {
        method: 'GET',
        url: '/v3/contactdb/lists'
    };

    return await apiRequest(request);
}

module.exports.getListRecipients = async function getListRecipients(listId, page, pageSize) {
    const request = {
        method: 'GET',
        url: '/v3/contactdb/lists/' + listId + '/recipients',
        qs: {
            page: page,
            page_size: pageSize
        }
    };

    return await apiRequest(request);
}

module.exports.deleteRecipientFromList = async function deleteRecipientFromList(listId, recipientId) {
    const request = {
        method: 'DELETE',
        url: '/v3/contactdb/lists/' + listId + '/recipients/' + recipientId,
        qs: {
            list_id: listId,
            recipient_id: recipientId
        }
    };

    return await apiRequest(request);
}