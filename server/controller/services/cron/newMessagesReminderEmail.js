const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running new messages cron');

    let currentTime = new Date();
    console.log(currentTime);
    currentTime.setSeconds(currentTime.getSeconds() + 20); //+20 Secs
    console.log(currentTime);
    //let currentTime1Hour = currentTime.setTime(this.getTime() + (1*60*60*1000));
    //console.log(currentTime.setTime(currentTime.getTime()));
    //process.exit();

    let userDoc = await users.find({
        "conversations": {
            $elemMatch: {
                "unread_count": {$gt: 0},
                "last_message": {$gte: currentTime},
                "last_message": {$lt: currentTime}
            },
        },
        is_unread_msgs_to_send: true,
        last_message_reminder_email: {$gte: currentTime}
    });

    for(let i=0; i < userDoc.length; i++){
        console.log(userDoc[i].email);
        /*if(userDoc[i].type === 'candidate'){
            chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, userDoc[i].first_name);
        }
        else{
            let companyDoc = await companies.findOne({ _creator: userDoc[i]._id},{"first_name":1});
            if(companyDoc){
                chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, companyDoc.first_name);
            }
        }*/
    }
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}