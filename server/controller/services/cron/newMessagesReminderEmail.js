const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/companies');
const newMessagesReminderEmail = require('../email/emails/newMessagesReminder');
const logger = require('../logger');
const time = require('../time');

const intervalSeconds = 20;

module.exports = async function() {
    logger.debug('Running new messages cron');

    let timeMinus20s = new Date();
    time.addSeconds(timeMinus20s,  -intervalSeconds*1.1); //-20 Secs
    let timeMinus1hr = new Date(timeMinus20s);
    time.addSeconds(timeMinus1hr, -3600); //-1 hour 20 Secs

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
            newMessagesReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, userDoc.first_name);
            await users.update({ _id: userDoc._id},{ $set: {'last_message_reminder_email': Date.now()} });
        }
        else{
            let companyDoc = await companies.findOne({ _creator: userDoc._id},{"first_name":1});
            if(companyDoc){
                newMessagesReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, companyDoc.first_name);
                await users.update({ _id: userDoc._id},{ $set: {'last_message_reminder_email': Date.now()} });
            }
            else {
                logger.error("company account not found", userDoc._id);
            }
        }
    });
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}