const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const logger = require('./logger');
const objects = require('./objects');
const errors = require('./errors');
const crypto = require('./crypto');
const zoho = require('./zoho/zoho');
const sendgrid = require('./email/sendGrid');
const settings = require('../../settings');

module.exports.pushToQueue = async function(operation, userDoc, companyDoc) {
    const timestamp = Date.now();
    let syncDoc = {
        queue: userDoc.type,
        operation: operation,
        status: 'pending',
        added_to_queue: timestamp
    };

    if (userDoc) syncDoc.user = userDoc;
    if (companyDoc) syncDoc.company = companyDoc;

    if (operation === "PATCH") {
        const existingSyncDoc = await syncQueue.findOne({"user._id": userDoc._id, status: 'pending', operation: operation});

        if (existingSyncDoc) {
            delete syncDoc.queue;
            delete syncDoc.operation;
            delete syncDoc.status;
            await syncQueue.updateOne({_id: existingSyncDoc._id}, { $set: syncDoc });
        } else {
            await syncQueue.insert(syncDoc);
        }
    } else {
        await syncQueue.insert(syncDoc);
    }
}

module.exports.pullFromQueue = async function() {

    let syncDocs = await syncQueue.findSortLimitSkip({status: 'pending', operation: "POST"}, {added_to_queue: "ascending"}, 100, null);
    await syncZoho("POST", syncDocs);

    syncDocs = await syncQueue.findSortLimitSkip({status: 'pending', operation: "PATCH"}, {added_to_queue: "ascending"}, 100, null);
    await syncZoho("PATCH", syncDocs);

    // sync to amplitude
    // sync to sendgrid?
}

const syncZoho = async function (operation, syncDocs) {
    const docIds = syncDocs.map((syncDoc) => { return syncDoc._id })

    let zohoData = [];
    try {
        for (let syncDoc of syncDocs) {
            syncDoc.user.email = sendgrid.addEmailEnvironment(syncDoc.user.email);
            const zohoContact = await toZohoContact(syncDoc);
            if (operation === "PATCH" && !zohoContact.id) {
                let userDoc = await users.findOne({_id: syncDoc.user._id});
                if (!userDoc.zohocrm_contact_id) throw new Error("No zohocrm contact id found on user: " + userDoc._id)
                zohoContact.id = userDoc.zohocrm_contact_id;
            }
            zohoData.push(zohoContact);
        }

        let input = {
            body: {
                data: zohoData
            },
            duplicate_check_fields: ["Email"]
        };
        let res;
        if (operation === "POST") {
            res = await zoho.contacts.upsert(input);
        } else {
            res = await zoho.contacts.putMany(input);
        }

        let docsToDelete = [], i = 0;
        for (let contactRecord of res) {
            if (contactRecord.status === "error") {
                const errorId = crypto.getRandomString(10);
                let message = "Zoho CRM record message: " + contactRecord.message;
                if (!objects.isEmpty(contactRecord.details)) message = message + ", details: " + JSON.stringify(contactRecord.details);
                logger.error(message, {
                    error_id: errorId,
                    code: contactRecord.code
                });
                await
                syncQueue.updateOne({_id: docIds[i]}, {
                    $set: {
                        status: "error",
                        error_id: errorId
                    }
                });
            } else {
                if (operation === "POST") {
                    await users.updateOne({_id: syncDocs[i].user._id}, {$set: {zohocrm_contact_id: contactRecord.details.id}})
                }
                docsToDelete.push(docIds[i]);
            }
            i++;
        }

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


const toZohoContact = async function (syncDoc) {
    const userDoc = syncDoc.user;

    let contact = {
        Contact_Status: "converted",
        Contact_type: [userDoc.type],
        Email: userDoc.email,
        First_Name: userDoc.first_name,
        Last_Name: userDoc.last_name,
        Synced_from_server: true,
        Platform_ID: userDoc._id.toString(),
        Email_verified: userDoc.is_verify === 1,
        Account_disabled: userDoc.disable_account,
        Environment: settings.ENVIRONMENT
    };

    if (userDoc.session_started) contact.Last_login = convertZohoDate(userDoc.session_started);
    if (userDoc.nationality) contact.Nationalities = userDoc.nationality.map((nat) => { return nat + "\n"});
    if (userDoc.first_approved_date) contact.First_approved = convertZohoDate(userDoc.first_approved_date);
    if (userDoc.marketing_emails) contact.Marketing_emails = userDoc.marketing_emails;
    if (userDoc.contact_number) contact.Phone = userDoc.contact_number;
    if (userDoc.zohocrm_contact_id) contact.id = userDoc.zohocrm_contact_id;

    if (userDoc.type === "candidate" && userDoc.candidate) {
        const candidateDoc = userDoc.candidate;
        contact.Candidate_status = candidateDoc.latest_status.status;
        contact.Candidate_status_last_updated = convertZohoDate(candidateDoc.latest_status.timestamp);
        contact.Created = convertZohoDate(candidateDoc.history[candidateDoc.history.length-1].timestamp);

        if (candidateDoc.base_country) contact.Mailing_country = candidateDoc.base_country;
        if (candidateDoc.base_city) contact.Mailing_city = candidateDoc.base_city;
        if (candidateDoc.job_activity_status) {
            const employed = candidateDoc.job_activity_status.currently_employed;
            if (employed) contact.Currently_employed = employed === "yes";
        }
        if (candidateDoc.programming_languages) contact.Programming_languages = candidateDoc.programming_languages.map( (lan) => {
            return lan.language + "\n";
        })
        if (candidateDoc.description) contact.Bio = candidateDoc.description;
    }

    // let companyDoc;
    // if (syncDoc.company) companyDoc = syncDoc.company;

    return contact;
};

let currentUserUTCOffsetHours;

const convertZohoDate = async function(date) {
    // TODO: convert dates based on current user time zone...
    if (!currentUserUTCOffsetHours) {
        const res = await zoho.users.getCurrentUser()
        currentUserUTCOffsetHours = res.users[0].offset / (1000*60*60);
    }
    if (date) return toISOString(date);
    // if (date) return date.toISOString();
}

const toISOString = function(date) {
    function pad(number) {
        if (number < 10) {
            return '0' + number;
        }
        return number;
    }

    return date.getUTCFullYear() +
        '-' + pad(date.getUTCMonth() + 1) +
        '-' + pad(date.getUTCDate()) +
        'T' + pad(date.getUTCHours()) +
        ':' + pad(date.getUTCMinutes()) +
        ':' + pad(date.getUTCSeconds()) +
        '+00:00';
};