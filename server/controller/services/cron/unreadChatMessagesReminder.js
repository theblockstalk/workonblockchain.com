const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/companies');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running unread chat messages cron');
    let timeMinus1hr = new Date();
    timeMinus1hr.setSeconds(timeMinus1hr.getSeconds() - 3620); //-1 hour 20 Secs

    let userDoc = await users.find({
        "conversations": {
            "$elemMatch":{"unread_count":{$gte:1}}
        },
        is_unread_msgs_to_send: true,
        $or: [{
            last_message_reminder_email: {$exists: false}
        }, {
            last_message_reminder_email: {$lt: timeMinus1hr}
        }]
    });

    for(let i=0; i < userDoc.length; i++){
        if(userDoc[i].type === 'candidate'){
            chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, userDoc[i].first_name);
            await users.update({ _id: userDoc[i]._id},{ $set: {'last_message_reminder_email': Date.now()} });
        }
        else{
            let companyDoc = await companies.findOne({ _creator: userDoc[i]._id},{"first_name":1});
            if(companyDoc){
                chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, companyDoc.first_name);
                await users.update({ _id: userDoc[i]._id},{ $set: {'last_message_reminder_email': Date.now()} });
            }
        }
    }
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}