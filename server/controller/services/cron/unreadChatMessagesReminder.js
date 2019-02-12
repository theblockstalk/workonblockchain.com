const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');
const chat = require('../../../model/chat');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = async function () {
    logger.debug('Running unread chat messages cron');

    let userDoc = await users.find({ "conversations": {"$elemMatch":{"unread_count":{$gte:1}}}, is_unread_msgs_to_send: true});

    for(let i=0; i < userDoc.length; i++){
        if(userDoc[i].type === 'candidate'){
            chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, userDoc[i].first_name);
        }
        else{
            let companyDoc = await companies.findOne({ _creator: userDoc[i]._id},{"first_name":1});
            if(companyDoc){
                chatReminderEmail.sendEmail(userDoc[i].email, userDoc[i].disable_account, companyDoc.first_name);
            }
        }
    }
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}