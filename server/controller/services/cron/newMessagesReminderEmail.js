const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running new messages cron');

    let userDoc = await users.find({
        "conversations": {
            "$elemMatch":{
                "unread_count":{$gte:0},
                "last_message": {$gte: ISODate("2019-04-01T10:36:43.626Z")}, //+20 secs
                "last_message": {$lt: ISODate("2019-04-01T10:36:43.626Z")} // +1 hour and 20 secs
            },
            "last_message_reminder_email": {$gte: ISODate("2019-04-01T10:36:43.626Z")} // +1 hour and 20 secs
        }, is_unread_msgs_to_send: true
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