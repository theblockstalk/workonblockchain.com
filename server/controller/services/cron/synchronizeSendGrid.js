const sendGrid = require('../email/sendGrid');
const logger = require('../logger');
const settings = require('../../../settings');


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

    for (list of lists.lists) {
        if (list.name === listName) {
            return list;
        }
    }
}

async function deleteRecipientsNotInDatabase(listId, recipientCount) {
    let pageSize = 100, page = 1, i = 1;

    while((page - 1) * pageSize < recipientCount) {
        recipients = await sendGrid.getListRecipients(list.id, page, pageSize);
        for (let recipient of recipients.recipients) {
            console.log(i, recipient.email);
            i++;
            const userDoc =
        }
        page++;
    }
}