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
    const syncDocs = await syncQueue.findSortLimitSkip({status: 'pending'}, {added_to_queue: "ascending"}, 100, null);

    const docIds = syncDocs.map((syncDoc) => { return syncDoc._id })

    let syncQueues = {
        zoho: {
            contacts: [],

        }
    };

    try {
        for (let syncDoc of syncDocs) {
            syncDoc.user.email = sendgrid.addEmailEnvironment(syncDoc.user.email);
            const zohoContact = toZohoContact(syncDoc);
            syncQueues.zoho.contacts.push(zohoContact);
        }

        const input = {
            body: {
                data: syncQueues.zoho.contacts
            },
            duplicate_check_fields: [ "Email" ]
        };
        const res = await zoho.contacts.upsert(input);

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
                await syncQueue.updateOne({ _id: docIds[i] }, {
                    $set: {
                        status: "error",
                        error_id: errorId
                    }
                });
            } else {
                if (syncQueues.zoho.contacts[i].operation === "POST") {
                    await users.updateOne({_id: syncQueues.zoho.contacts[i].user._id}, {$set: { zohocrm_contact_id: contactRecord.id}})
                }
                docsToDelete.push(docIds[i]);
            }
            i++;
        }

        await syncQueue.deleteMany({_id: { $in: docIds}});

        // sync to amplitude
        // sync to sendgrid?
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
        Contact_Status: "converted",
        Contact_type: [userDoc.type],
        Email: userDoc.email,
        First_Name: userDoc.first_name,
        Last_Name: userDoc.last_name,
        Synced_from_server: true,
        Platform_ID: userDoc._id.toString(),
        Email_verified: userDoc.is_verify === 1,
        Account_disabled: userDoc.disable_account,
        Environment: settings.ENVIRONMENT,
    };

    if (userDoc.session_started) contact.Last_login = convertZohoDate(userDoc.session_started);
    if (userDoc.nationality) contact.Nationalities = userDoc.nationality.map((nat) => { return nat + "\n"});
    if (userDoc.first_approved_date) contact.First_approved = convertZohoDate(userDoc.first_approved_date);
    if (userDoc.marketing_emails) contact.Marketing_emails = userDoc.marketing_emails;
    if (userDoc.contact_number) contact.Phone = userDoc.contact_number;

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

const convertZohoDate = function(date) {
    // TODO: convert dates based on current user time zone...
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