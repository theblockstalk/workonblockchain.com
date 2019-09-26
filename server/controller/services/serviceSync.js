const syncQueue = require('../../model/mongoose/sync_queue');
const users = require('../../model/mongoose/users');
const companies = require('../../model/mongoose/companies');
const logger = require('./logger');
const objects = require('./objects');
const crypto = require('./crypto');
const time = require('./time');
const zoho = require('./zoho/zoho');
const settings = require('../../settings');

module.exports.pushToQueue = async function(operation, obj) {
    const timestamp = Date.now();
    let syncDoc = {
        operation: operation,
        status: 'pending',
        added_to_queue: timestamp
    };

    let userDoc = obj.user;
    if (userDoc) {
        syncDoc.queue = userDoc.type;
        syncDoc.user = userDoc;
        if (obj.company) syncDoc.company = obj.company;

        logger.debug("Adding to sync queue", { syncDoc: syncDoc,
            tag: "sync_queue"});
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
}

module.exports.pullFromQueue = async function() {
    logger.debug("Checking the sync queue", {tag: "sync_queue"});
    let syncDocs = await syncQueue.findSortLimitSkip({status: 'pending', operation: "POST"}, {added_to_queue: "ascending"}, 100, null);
    if (syncDocs && syncDocs.length > 0) await syncZoho("POST", syncDocs);


    syncDocs = await syncQueue.findSortLimitSkip({status: 'pending', operation: "PATCH"}, {added_to_queue: "ascending"}, 100, null);
    if (syncDocs && syncDocs.length > 0) {
        await time.sleep(1000);
        await syncZoho("PATCH", syncDocs);
    }
    // sync to amplitude
    // sync to sendgrid?
}

const syncZoho = async function (operation, syncDocs) {
    logger.debug(syncDocs.length + " items to syncronize of operation " + operation, {tag: "sync_queue"});
    const docIds = syncDocs.map((syncDoc) => { return syncDoc._id })

    let zohoContacts = [], zohoAccounts = [];
    try {
        for (let syncDoc of syncDocs) {
            syncDoc.user.email = addEmailEnvironment(syncDoc.user.email);
            const zohoContact = await toZohoContact(syncDoc);

            if (syncDoc.company) {
                let zohoAccount = await toZohoAccount(syncDoc);

                if (operation === "PATCH" && !zohoAccount.id) {
                    let companyDoc = await companies.findOne({_id: syncDoc.company._id});
                    if (!companyDoc.zohocrm_account_id) throw new Error("No zohocrm account id found on company: " + companyDoc._id)
                    zohoAccount.id = companyDoc.zohocrm_account_id;
                }

                zohoAccounts.push(zohoAccount);
            }

            if (operation === "PATCH" && !zohoContact.id) {
                let userDoc = await users.findOne({_id: syncDoc.user._id});
                if (!userDoc.zohocrm_contact_id) throw new Error("No zohocrm contact id found on user: " + userDoc._id)
                zohoContact.id = userDoc.zohocrm_contact_id;
            }

            zohoContacts.push(zohoContact);
        }

        const zohoModuleSync = async function(data, module, deleteSyncDoc) {
            let input = { body: { data: data } };
            if (module === "contacts") input.duplicate_check_fields = ["Email"];
            if (module === "accounts") input.duplicate_check_fields = ["Account_Name"];

            let res, records;
            if (operation === "POST") {
                logger.debug("upsert to Zoho " + module, { input: input, tag: "sync_queue"});
                res = await zoho[module].upsert(input);
            } else {
                logger.debug("put to Zoho " + module, { input: input, tag: "sync_queue"});
                res = await zoho[module].putMany(input);
            }
            records = res.data;

            let docsToDelete = [], i = 0;
            let errorIndexes = [];
            for (let record of records) {
                if (record.status === "error") {
                    const errorId = crypto.getRandomString(10);
                    let message = "Zoho CRM " + module + " record error: " + record.message;
                    if (!objects.isEmpty(record.details)) message = message + ", details: " + JSON.stringify(record.details);
                    logger.error(message, {
                        error_id: errorId,
                        code: record.code,
                        tag: "sync_queue"
                    });
                    await syncQueue.updateOne({_id: docIds[i]}, {
                        $set: {
                            status: "error",
                            error_id: errorId
                        }
                    });
                    errorIndexes.push(i);
                } else {
                    if (operation === "POST") {
                        if (module === "contacts") {
                            await users.updateOne({_id: syncDocs[i].user._id}, {$set: {zohocrm_contact_id: record.details.id}})
                        } else if (module === "accounts") {
                            await companies.updateOne({_id: syncDocs[i].company._id}, {$set: {zohocrm_account_id: record.details.id}})
                        }
                    }
                    if (deleteSyncDoc) docsToDelete.push(docIds[i]);
                }
                i++;
            }
            return errorIndexes;
        }

        if (zohoAccounts.length > 0) {
            logger.debug("Syncing zoho accounts", {
                data: zohoAccounts,
                tag: "sync_queue"
            });
            let errorIndexes = await zohoModuleSync(zohoAccounts, "accounts", false);
            let count = 0;
            if (errorIndexes.length > 0) logger.debug("Error with account syncing", {indexes:errorIndexes, tag: "sync_queue"});
            for (let i of errorIndexes) {
                zohoContacts.splice(i-count, 1);
                count++;
            }
        }
        logger.debug("Syncing zoho contacts", {
            data: zohoContacts,
            tag: "sync_queue"
        });
        await zohoModuleSync(zohoContacts, "contacts", true);

        logger.debug("Removin docs from sync queue", { docs: docIds, tag: "sync_queue"});
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
            },
            tag: "sync_queue"
        });
        await syncQueue.updateMany({_id: { $in: docIds}}, {
            status: "error",
            error_id: errorId
        });
    }
}

const toZohoContact = async function (syncDoc) {
    const userDoc = syncDoc.user;
    const companyDoc = syncDoc.company;

    let contact = {
        Contact_Status: "converted",
        Contact_type: [userDoc.type],
        Email: userDoc.email,
        Synced_from_server: true,
        Platform_ID: userDoc._id.toString(),
        Platform_URL: convertZohoURL(settings.CLIENT.URL + "admins/talent/" + userDoc._id.toString()),
        Email_verified: userDoc.is_verify === 1,
        Account_disabled: userDoc.disable_account,
        Environment: settings.ENVIRONMENT
    };

    if (userDoc.session_started) contact.Last_login = await convertZohoDate(userDoc.session_started);
    if (userDoc.marketing_emails) contact.Marketing_emails = userDoc.marketing_emails;
    if (userDoc.zohocrm_contact_id) contact.id = userDoc.zohocrm_contact_id;

    if (userDoc.type === "candidate") {
        contact.First_Name = userDoc.first_name;
        contact.Last_Name =userDoc.last_name;
        if (userDoc.contact_number) contact.Phone = userDoc.contact_number;
        if (userDoc.nationality) contact.Nationalities = userDoc.nationality.map((nat) => { return nat + "\n"});
        if (userDoc.first_approved_date) contact.First_approved = await convertZohoDate(userDoc.first_approved_date);

        const candidateDoc = userDoc.candidate;
        if (candidateDoc) {
            contact.Candidate_status = candidateDoc.latest_status.status;
            contact.Candidate_status_last_updated = await convertZohoDate(candidateDoc.latest_status.timestamp);
            contact.Created = await convertZohoDate(candidateDoc.history[candidateDoc.history.length-1].timestamp);

            if (candidateDoc.description) contact.Description = candidateDoc.description;
            if (candidateDoc.linkedin_account) contact.Linkedin_UR = candidateDoc.linkedin_account;
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
    }  else {
        contact.First_Name = companyDoc.first_name;
        contact.Last_Name = companyDoc.last_name;
        contact.Created = await convertZohoDate(userDoc.created_date)
        contact.Account_Name = companyDoc.company_name
    }

    return contact;
}

const environmentName = "wob_" + settings.ENVIRONMENT + "_environment";

const addEmailEnvironment = function(email) {
    if (settings.ENVIRONMENT !== "production") {
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
    } else {
        return email;
    }
};
module.exports.addEmailEnvironment = addEmailEnvironment;

module.exports.removeEmailEnvironment = function (email) {
    if (settings.ENVIRONMENT !== "production") {
        const at = email.search("@");
        const env = email.search(environmentName);
        const name = email.substring(0, env - 1);
        const domain = email.substring(env + environmentName.length + 1);
        return name + "@" + domain;
    } else {
        return email;
    }
};

const addNameEnvironment = function(name) {
    if (settings.ENVIRONMENT !== "production") {
        return settings.ENVIRONMENT.toUpperCase() + " - " + name;
    }
    return name;
};

const toZohoAccount = async function (syncDoc) {
    const userDoc = syncDoc.user;
    const companyDoc = syncDoc.company;

    const created = await convertZohoDate(userDoc.created_date);
    let account = {
        Account_Name: addNameEnvironment(companyDoc.company_name),
        Platform_ID: companyDoc._id.toString(),
        Platform_URL: convertZohoURL(settings.CLIENT.URL + "admin-company-detail?user=" + userDoc._id.toString()),
        Account_Types: ["Client"],
        Synced_from_server: true,
        Environment: settings.ENVIRONMENT,
        Platform_Status: companyDoc.is_approved === 1 ? "approved" : "not approved",
        Account_status: "Active",
        Account_disabled: userDoc.disable_account,
        Created: created
    };


    if (companyDoc.company_website) account.Website = companyDoc.company_website;
    if (companyDoc.company_country) account.Billing_Country = companyDoc.company_country;
    if (companyDoc.company_city) account.Billing_City = companyDoc.company_city;
    if (companyDoc.company_funded) account.How_is_company_funded = companyDoc.company_funded;
    if (companyDoc.company_description) account.Description = companyDoc.company_description;
    if (companyDoc.zohocrm_account_id) account.id = companyDoc.zohocrm_account_id;

    return account;
}

const convertZohoURL = function(url) {
    if (!settings.isLiveApplication()) return url.replace(settings.CLIENT.URL, "https://test.workonblockchain.com/");
    return url;
};

let zohoUserOffsetSeconds;

const convertZohoDate = async function(date) {
    // TODO: convert dates based on current user time zone...
    // if (!zohoUserOffsetSeconds) {
    //     const res = await zoho.users.getCurrentUser();
    //     const user = res.users[0];
    //     zohoUserOffsetSeconds = user.offset / 1000;
    // }
    // if (date) {
    //     let now = new Date();
    //     const localOffsetSeconds = now.getTimezoneOffset() * 60;
    //     logger.debug("Date offsets", {
    //         localHour: localOffsetSeconds/(60*60),
    //         zohoUserHour: zohoUserOffsetSeconds/(60*60)
    //     });
    //     const diff = localOffsetSeconds - zohoUserOffsetSeconds
    //     if (diff !== 0) {
    //         time.addSeconds(date, diff);
    //     }
        time.addSeconds(date, 0*60*60);
        return toISOString(date)
    // }
    // if (date) return date.toISOString(); // does not work
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