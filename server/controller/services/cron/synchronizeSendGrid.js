const sendGrid = require('../email/sendGrid');
const logger = require('../logger');
const settings = require('../../../settings');
const mongooseUsers = require('../../../model/mongoose/users');


module.exports = async function() {
    // const list = await getList(settings.ENVIRONMENT);
    const list = await getList("Users");
    const listId = list.id;
    const recipientCount = list.recipient_count;

    await deleteRecipientsNotInDatabase(listId, recipientCount);
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
    const userDoc = await mongooseUsers.findOneByEmail("sarakhan10024@gmail.com");
    // console.log(userDoc);
    // let pageSize = 100, page = 1, i = 1;
    //
    // while((page - 1) * pageSize < recipientCount) {
    //
    //     let recipients = await sendGrid.getListRecipients(listId, page, pageSize);
    //
    //     for (const recipient of recipients.recipients) {
    //         if (i < 10) console.log(i, recipient.email);
    //         i++;
    //         const userDoc = await mongooseUsers.findOneByEmail(recipient.email);
    //         console.log(userDoc);
    //         if (!userDoc) {
    //             // await sendGrid.deleteRecipientFromList(listId, recipient.id)
    //         }
    //     }
    //     page++;
    // }
}