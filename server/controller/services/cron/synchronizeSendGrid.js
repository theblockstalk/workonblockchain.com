const sendGrid = require('../email/sendGrid');
const logger = require('../logger');
const settings = require('../../../settings');
const mongooseUsers = require('../../../model/mongoose/users');
const mongooseCandidate = require('../../../model/mongoose/candidate');
const mongooseReferrals = require('../../../model/mongoose/referrals');


module.exports = async function() {
    // const list = await getList(settings.ENVIRONMENT);
    const list = await getList("staging");
    const listId = list.id;
    const recipientCount = list.recipient_count;

    await deleteRecipientsNotInDatabase(listId, recipientCount);

    await synchDatabasetoList(listId);
    logger.info('Synchronized all users to Sendgrid', {timestamp: Date.now()});
}

async function getList(listName) {
    let lists = await sendGrid.getAllLists();

    for (const list of lists.lists) {
        if (list.name === listName) {
            return list;
        }
    }
}

async function deleteRecipientsNotInDatabase(listId, recipientCount) {
    let pageSize = 100, page = 1, i = 1;

    while((page - 1) * pageSize < recipientCount) {

        let recipients = await sendGrid.getListRecipients(listId, page, pageSize);

        for (const recipient of recipients.recipients) {
            console.log(i, recipient.email);
            const userDoc = await mongooseUsers.findOneByEmail(recipient.email);
            if (userDoc) {
                if (!userDoc.sendgrid_id) {
                    logger.debug('  Adding sendgrid_id to user ' + recipient.email + '')
                    await mongooseUsers.update({_id: userDoc._id}, {$set: {sendgrid_id: recipient.id}});
                }
            } else {
                // logger.debug('  Deleting contact ' + recipient.email + ' from Sendgrid')
                // await sendGrid.deleteRecipient(recipient.id)
            }
            i++;
        }
        page++;
    }
}

async function synchDatabasetoList(listId) {
    await mongooseUsers.findAndIterate({}, async function(userDoc) {
        console.log('Synchronizing ' + userDoc.email);

        const referralDoc = await mongooseReferrals.findOneByEmail(userDoc.email);
        console.log(referralDoc);
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
                    verify_email_key: userDoc.verify_email_key,
                    account_dissabled: userDoc.disable_account.toString(),
                    approved: userDoc.is_approved,
                    email_verified: userDoc.is_verify,
                    terms_id: candidateDoc.terms_id,
                    created_date: userDoc.created_date
                };
                recipientUpdate[settings.ENVIRONMENT + "_user_id"] = userDoc._id.toString();
                logger.debug('Updating sendgrid recipient', recipientUpdate);

                // try {
                    const updateResponse = await sendGrid.updateRecipient(recipientUpdate);
                    if (updateResponse.error_count > 0) {
                        logger.error("Error updating user", {
                            update: recipientUpdate,
                            response: updateResponse
                        });
                    }

                    await sendGrid.addRecipientToList(listId, updateResponse.persisted_recipients[0]);
                // } catch (error) {
                //     logger.error("Error updating sendgrid recipient" + recipientUpdate.email, error);
                // }
            } else {
                logger.error("Candidate doc for user " + userDoc._id + " not found during sendGrid sync")
            }
        } else {

        }
        
    })
}