const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');
const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    await newMessagesReminder();
    setInterval(newMessagesReminder, 20000);
}

const newMessagesReminder = async function () {
    logger.debug('Running new messages cron');

    let timeMinus20s = new Date();
    timeMinus20s.setSeconds(timeMinus20s.getSeconds() - 20); //-20 Secs
    let timeMinus1hr = timeMinus20s;
    timeMinus1hr.setSeconds(timeMinus1hr.getSeconds() - 3600); //-1 hour 20 Secs

    await users.findAndIterate({
        "conversations": {
            $elemMatch: {
                "unread_count": {$gt: 0},
                "last_message": {$gte: timeMinus20s}
            },
        },
        is_unread_msgs_to_send: true,
        $or: [{
            last_message_reminder_email: {$exists: false}
        }, {
            last_message_reminder_email: {$lt: timeMinus1hr}
        }]
    },async function(userDoc) {
        if(userDoc.type === 'candidate'){
            chatReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, userDoc.first_name);
            await users.update({ _id: userDoc._id},{ $set: {'last_message_reminder_email': Date.now()} });
        }
        else{
            let companyDoc = await companies.findOne({ _creator: userDoc._id},{"first_name":1});
            if(companyDoc){
                chatReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, companyDoc.first_name);
                await users.update({ _id: userDoc._id},{ $set: {'last_message_reminder_email': Date.now()} });
            }
            else {
                logger.error("company account not found", userDoc._id);
            }
        }
    });
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}