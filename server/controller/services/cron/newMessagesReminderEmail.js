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
    let plusOneHour = currentTime;
    plusOneHour.setSeconds(plusOneHour.getSeconds() + 3600); //+1 hour Secs
    console.log(plusOneHour);
    //process.exit();

    let userDoc = await users.find({
        "conversations": {
            $elemMatch: {
                "unread_count": {$gt: 0},
                "last_message": {$gte: currentTime}, //+20 secs
                "last_message": {$lt: plusOneHour} //+1 hour and 20secs
            },
        },
        is_unread_msgs_to_send: true,
        last_message_reminder_email: {$gte: plusOneHour} //+1 hour and 20secs
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