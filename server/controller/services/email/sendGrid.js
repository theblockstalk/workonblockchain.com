const settings = require('../../../settings');
const logger = require('../logger');
const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');
const time = require('../time');

const throttleTimeMs = 400;
const environmentName = "wob_" + settings.ENVIRONMENT + "_environment";

if (settings.isLiveApplication()) {
    logger.debug("Setting Sendgrid API key");
    sgMail.setApiKey(settings.SENDGRID.API_KEY);
    sgClient.setApiKey(settings.SENDGRID.API_KEY);
}

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
    let response, body;
    logger.debug('Sendgrid API request', request);

    if (settings.isLiveApplication()) {
        [response, body] = await
        sgClient.request(request);

        if (response.statusCode < 200 || response.statusCode >= 300) {
            logger.error("Sendgrid API request failed", response);
            throw new Error();
        }
        return response.body;
    } else {
        return;
    }
}

module.exports.addEmailEnvironment = function addEmailEnvironment(email) {
    const at = email.search("@");
    const plus = email.search(/\+/g); // "+" symbol
    let name;
    if (plus !== -1) {
        name = email.substring(0,at) + "_" + environmentName;
    } else {
        name = email.substring(0,at) + "+" + environmentName;
    }
    const domain = email.substring(at+1);
    return name + "@" + domain;
};

module.exports.removeEmailEnvironment = function removeEmailEnvironment(email) {
    const at = email.search("@");
    const env = email.search(environmentName);
    const name = email.substring(0, env - 1);
    const domain = email.substring(env + environmentName.length + 1);
    return name + "@" + domain;
};

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

module.exports.deleteRecipient = async function deleteRecipientFromList(recipientId) {
    const request = {
        method: 'DELETE',
        url: '/v3/contactdb/recipients/' + recipientId
    };

    return await apiRequest(request);
}

let lastRequest;
module.exports.updateRecipient = async function updateRecipient(data) {
    if (settings.ENVIRONMENT !== "production") {
        data.email = this.addEmailEnvironment(data.email);
    }

    const request = {
        method: 'PATCH',
        url: '/v3/contactdb/recipients',
        body: [data]
    };

    const msTillRequest = lastRequest + throttleTimeMs - Date.now().valueOf();
    if (msTillRequest > 0) {
        await time.sleep(msTillRequest);
    }
    const response = await apiRequest(request);

    lastRequest = Date.now().valueOf();
    return response;
}

module.exports.searchRecipient = async function searchRecipient(query) {
    const request = {
        method: 'GET',
        url: '/v3/contactdb/recipients/search',
        qs: query
    };

    return await apiRequest(request);
}

module.exports.insertRecipient = async function insertRecipient(data) {
    const request = {
        method: 'POST',
        url: '/v3/contactdb/recipients',
        body: [data]
    };

    return await apiRequest(request);
}

module.exports.addRecipientToList = async function addRecipientToList(listId, recipientId) {
    const request = {
        method: 'POST',
        url: '/v3/contactdb/lists/' + listId + '/recipients/' + recipientId
    };

    return await apiRequest(request);
}

module.exports.getCustomFieldFromRecipient = function getCustomFieldFromRecipient(recipient, fieldName) {
    const array = recipient.custom_fields.filter(function (obj) {
        return obj.name === fieldName;
    });
    return array[0];
};