const settings = require('../../../settings');
const sendGrid = require('../email/sendGrid');
const logger = require('../logger');
const crypto = require('../crypto');
const mongooseUsers = require('../../../model/mongoose/users');
const mongooseCompany = require('../../../model/mongoose/company');
const mongooseReferral = require('../../../model/mongoose/referral');


module.exports = async function() {
    logger.debug('Running sync sendgrid cron');

    const list = await sendGrid.getList(settings.ENVIRONMENT);
    const listId = list.id;
    const recipientCount = list.recipient_count;
    logger.info('Synchronizing users to Sendgrid list ' + settings.ENVIRONMENT, {
        listId: listId
    });

    await syncListToDatabase(listId, recipientCount);

    let results = await synchDatabasetoList(listId);

    logger.info('Synchronized all users to Sendgrid', results);
}

async function syncListToDatabase(listId, recipientCount) {
    const pageSize = 100;
    let page = 1, i = 1;

    while((page - 1) * pageSize < recipientCount) {

        let recipients = await sendGrid.getListRecipients(listId, page, pageSize);

        for (const recipient of recipients.recipients) {
            logger.debug('(' + i + '/' + recipientCount + ') Checking that ' + recipient.email + ' is in database');
            let emailToSearch;
            if (settings.ENVIRONMENT !== "production") {
                emailToSearch = sendGrid.removeEmailEnvironment(recipient.email);
            } else {
                emailToSearch = recipient.email;
            }
            const userDoc = await mongooseUsers.findOneByEmail(emailToSearch);

            if (userDoc) {
                if (!userDoc.sendgrid_id) {
                    logger.debug('Adding sendgrid_id to user ' + recipient.email);

                    await mongooseUsers.update({_id: userDoc._id}, {$set: { sendgrid_id: recipient.id }});
                }
            } else {
                logger.debug('Deleting contact ' + recipient.email + ' from Sendgrid list ' + listId);
                const updateResponse = await sendGrid.updateRecipient({
                    email: emailToSearch,
                    user: "false"
                });
                await sendGrid.deleteRecipientFromList(listId, recipient.id);
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
            } catch (error) {
                logger.error(error.message, {
                    stack: error.stack,
                    name: error.name
                });
                errors = errors + 1;
            }
        }

        if (userDoc.type === "candidate") {
            const recipientUpdate = {
                email: userDoc.email,
                user_type: "candidate",
                user: "true",
                first_name: userDoc.first_name,
                last_name: userDoc.last_name,
                user_referral_key: referralDoc.url_token,
                user_account_disabled: userDoc.disable_account.toString(),
                user_status: userDoc.candidate.latest_status.status,
                user_email_verified: userDoc.is_verify,
                user_terms_id: userDoc.candidate.terms_id,
                user_created_date: userDoc.candidate.history[userDoc.candidate.history.length-1].timestamp,
                user_id: userDoc._id.toString()
            };
            if (userDoc.marketing_emails) {
                recipientUpdate.user_marketing_emails = userDoc.marketing_emails.toString();
            }

            await updateSendGridRecipient(listId, recipientUpdate);

        } else {
            let companyDoc = await mongooseCompany.findOneByUserId(userDoc._id);
            if (companyDoc) {
                const recipientUpdate = {
                    email: userDoc.email,
                    user_type: "company",
                    user: "true",
                    first_name: companyDoc.first_name,
                    last_name: companyDoc.last_name,
                    user_referral_key: referralDoc.url_token,
                    user_account_disabled: userDoc.disable_account.toString(),
                    user_approved: userDoc.is_approved,
                    user_email_verified: userDoc.is_verify,
                    user_terms_id: companyDoc.terms_id,
                    user_created_date: userDoc.created_date,
                    company_name: companyDoc.company_name,
                    user_id: userDoc._id.toString()
                };
                if (companyDoc.marketing_emails) {
                    recipientUpdate.user_marketing_emails = companyDoc.marketing_emails.toString();
                }

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