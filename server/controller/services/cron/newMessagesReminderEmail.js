const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');
const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running new messages cron');

    let startTime = new Date();
    let executed = 0;
    while (executed < 3) {
        const currentTime = new Date();
        startTime.setSeconds(startTime.getSeconds() + 20);
        console.log(currentTime);
        console.log(startTime);
        if (startTime > currentTime) {
            console.log('run send email ftn');
            let timeMinus20s = new Date();
            console.log(timeMinus20s);
            timeMinus20s.setSeconds(timeMinus20s.getSeconds() - 20); //-20 Secs
            console.log(timeMinus20s);
            let timeMinus1hr = timeMinus20s;
            timeMinus1hr.setSeconds(timeMinus1hr.getSeconds() - 3600); //-1 hour 20 Secs
            console.log(timeMinus1hr);

            await users.findAndIterate({
                "conversations": {
                    $elemMatch: {
                        "unread_count": {$gt: 0},
                        "last_message": {$gte: timeMinus20s}
                    },
                },
                is_unread_msgs_to_send: true,
                last_message_reminder_email: {$lt: timeMinus1hr}
            },async function(userDoc) {
                console.log(userDoc.email);
                console.log(userDoc._id);
                console.log(userDoc.type);
                if(userDoc.type === 'candidate'){
                    chatReminderEmail.sendEmail(userDoc.email, userDoc.disable_account, userDoc.first_name);
                    await users.update({ _id: userDoc._id},{ $set: {'last_message_reminder_email': Date.now()} });
                }
                else{
                    let companyDoc = await companies.findOne({ _creator: userDoc._id},{"first_name":1});
                    console.log(companyDoc.first_name);
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
        executed++;
        //await sleep(2000) // will i use this?
        console.log('sleep for 20 secs');
    }
}