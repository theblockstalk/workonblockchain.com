const syncQueue = require('../../model/mongoose/sync_queue');
const logger = require('./logger');
const errors = require('./errors');
const crypto = require('./crypto');
const zoho = require('./zoho/zoho');

module.exports.pushToQueue = async function(operation, userDoc, companyDoc) {
    let syncDoc = {
        queue: userDoc.type,
        operation: operation,
        status: 'pending',
        added_to_queue: Date.now()
    };

    if (userDoc) syncDoc.user = userDoc;
    if (companyDoc) syncDoc.company = companyDoc;

    await syncQueue.insert(syncDoc);
}

module.exports.pullFromQueue = async function() {
    const syncDocs = await syncQueue.findSortLimitSkip({status: 'pending'}, null, 100, null);

    const docIds = syncDocs.map((syncDoc) => { return syncDoc._id })

    let syncQueues = {
        zoho: {
            contacts: [],

        }
    };

    try {
        for (let syncDoc of syncDocs) {
            const zohoContact = toZohoContact(syncDoc);
            syncQueues.zoho.contacts.push(zohoContact);
        }

        const input = {
            data: syncQueues.zoho.contacts
        };
        const res = await zoho.contacts.postMany(input);

        // sync to amplitude
        // sync to sendgrid?


        await syncQueue.deleteMany({_id: { $in: docIds}});
    } catch (error) {
        console.log(error);
        const errorId = crypto.getRandomString(10);
        logger.error("Sync service error", {
            error: {
                id: errorId,
                code: error.code,
                message: error.message,
                stack: error.stack
            }
        });
        await syncQueue.updateMany({_id: { $in: docIds}}, {
            status: "error",
            error_id: errorId
        });

    }
}

const toZohoContact = function (syncDoc) {
    const userDoc = syncDoc.user;

    let contact = {
        // Contact_Status: "converted",
        // Contact_Type: userDoc.type,
        Email: userDoc.email,
        First_Name: userDoc.first_name,
        Last_Name: userDoc.last_name,
    };

    let companyDoc;
    if (syncDoc.company) companyDoc = syncDoc.company;

    return contact;
};