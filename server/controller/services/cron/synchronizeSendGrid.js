const sendGrid = require('../email/sendGrid');
const logger = require('../logger');
const crypto = require('../crypto');
const settings = require('../../../settings');
const mongooseUsers = require('../../../model/mongoose/users');
const mongooseCandidate = require('../../../model/mongoose/candidate');
const mongooseCompany = require('../../../model/mongoose/company');
const mongooseReferral = require('../../../model/mongoose/referral');


module.exports = async function() {
    logger.debug('Running sync sendgrid cron');

    if (settings.isLiveApplication()) {
        const list = await getList(settings.ENVIRONMENT);
        const listId = list.id;
        const recipientCount = list.recipient_count;
        logger.info('Synchronizing users to Sendgrid list ' + settings.ENVIRONMENT, {
            listId: listId
        });

        await syncListToDatabase(listId, recipientCount);

        let results = await synchDatabasetoList(listId);

        logger.info('Synchronized all users to Sendgrid', results);
    }
}

async function getList(listName) {
    let lists = await sendGrid.getAllLists();

    for (const list of lists.lists) {
        if (list.name === listName) {
            return list;
        }
    }
}

async function syncListToDatabase(listId, recipientCount) {
    const pageSize = 100;
    let page = 1, i = 1;

    while((page - 1) * pageSize < recipientCount) {

        let recipients = await sendGrid.getListRecipients(listId, page, pageSize);

        for (const recipient of recipients.recipients) {
            logger.debug('(' + i + '/' + recipientCount + ') Checking that ' + recipient.email + ' is in database');
            const userDoc = await mongooseUsers.findOneByEmail(recipient.email);

            if (userDoc) {
                if (!userDoc.sendgrid_id || userDoc.sendgrid_multipe_lists !== true) {
                    logger.debug('Adding sendgrid_id to user ' + recipient.email);

                    let set = { sendgrid_id: recipient.id };
                    const staging_user_id = sendGrid.getCustomFieldFromRecipient(recipient, "staging_user_id");
                    const production_user_id = sendGrid.getCustomFieldFromRecipient(recipient, "production_user_id");

                    if ( (staging_user_id.value && production_user_id.value) ||
                         (production_user_id.value && settings.ENVIRONMENT !== 'production') ) {
                        set.sendgrid_multipe_lists = true;
                    }
                    await mongooseUsers.update({_id: userDoc._id}, {$set: set});
                }
            } else {
                logger.debug('Deleting contact ' + recipient.email + ' from Sendgrid');
                await sendGrid.deleteRecipient(recipient.id)
            }
            i++;
        }
        page++;
    }
}

async function synchDatabasetoList(listId) {
    let added = 0, updated = 0, errors = 0, i = 1;
    const count = await mongooseUsers.count({});

    await mongooseUsers.findAndIterate({}, async function(userDoc) {
        logger.debug('(' + i + '/' + count + ') Synchronizing ' + userDoc.email);
        i++;

        let referralDoc = await mongooseReferral.findOneByEmail(userDoc.email);
        if (!referralDoc) {
            logger.warn("Referral not found for user " + userDoc.email + " during sendGrid sync, creating new referral doc")
            const token = crypto.getRandomString(10);
            referralDoc = await mongooseReferral.insert({
                email : userDoc.email,
                url_token : token,
                date_created: new Date(),
            });
        }

        async function updateSendGridRecipient(listId, recipientUpdate) {
            try {
                // If the user is in staging and production only update with production data
                if (!userDoc.sendgrid_multipe_lists || settings.ENVIRONMENT === 'production') {
                    logger.debug('Updating sendgrid recipient', recipientUpdate);

                    const updateResponse = await sendGrid.updateRecipient(recipientUpdate);

                    added = added + updateResponse.new_count;
                    updated = updated + updateResponse.updated_count;
                    errors = errors + updateResponse.error_count;

                    if (updateResponse.error_count > 0) {
                        logger.error("Error updating user", {
                            update: recipientUpdate,
                            response: updateResponse
                        });
                    }

                    const recipientId = updateResponse.persisted_recipients[0];
                    await mongooseUsers.update({_id: userDoc._id}, {$set: {sendgrid_id: recipientId}});
                    await sendGrid.addRecipientToList(listId, recipientId);
                } else {
                    logger.warn('User ' + recipientUpdate.email + ' was not updated to Sendgrid as this would overwrite the production recipient');
                }
            } catch (error) {
                logger.error(error.message, {
                    stack: error.stack,
                    name: error.name
                });
                errors = errors + 1;
            }
        }

        if (userDoc.type === "candidate") {
            let candidateDoc = await mongooseCandidate.findOneByUserId(userDoc._id);
            if (candidateDoc) {
                const recipientUpdate = {
                    email: userDoc.email,
                    type: "candidate",
                    user: "true",
                    first_name: candidateDoc.first_name,
                    last_name: candidateDoc.last_name,
                    referral_key: referralDoc.url_token,
                    account_dissabled: userDoc.disable_account.toString(),
                    approved: userDoc.is_approved,
                    email_verified: userDoc.is_verify,
                    terms_id: candidateDoc.terms_id,
                    created_date: userDoc.created_date
                };
                if (candidateDoc.marketing_emails) {
                    recipientUpdate.marketing_emails = candidateDoc.marketing_emails.toString();
                }
                recipientUpdate[settings.ENVIRONMENT + "_user_id"] = userDoc._id.toString();

                await updateSendGridRecipient(listId, recipientUpdate);
            } else {
                logger.error("Candidate doc for user " + userDoc._id + " not found during sendGrid sync");
                errors = errors + 1;
            }
        } else {
            let companyDoc = await mongooseCompany.findOneByUserId(userDoc._id);
            if (companyDoc) {
                const recipientUpdate = {
                    email: userDoc.email,
                    type: "company",
                    user: "true",
                    first_name: companyDoc.first_name,
                    last_name: companyDoc.last_name,
                    referral_key: referralDoc.url_token,
                    account_dissabled: userDoc.disable_account.toString(),
                    approved: userDoc.is_approved,
                    email_verified: userDoc.is_verify,
                    terms_id: companyDoc.terms_id,
                    created_date: userDoc.created_date,
                    company_name: companyDoc.company_name
                };
                if (companyDoc.marketing_emails) {
                    recipientUpdate.marketing_emails = companyDoc.marketing_emails.toString();
                }
                recipientUpdate[settings.ENVIRONMENT + "_user_id"] = userDoc._id.toString();

                await updateSendGridRecipient(listId, recipientUpdate);
            } else {
                logger.error("Company doc for user " + userDoc._id + " not found during sendGrid sync");
                errors = errors + 1;
            }
        }
    })

    return {
        added: added,
        updated: updated,
        errors: errors
    }
}