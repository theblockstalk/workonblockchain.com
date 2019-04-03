const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const errors = require('../../services/errors');
const cronSyncSendgrid = require('../../services/cron/synchronizeSendGrid');
const cronCompanyAutoEmail = require('../../services/cron/companyAutomaticEmailOfNewCandidate');
const cronUnreadChat = require('../../services/cron/unreadChatMessagesReminder');
const cronNewMessages = require('../../services/cron/newMessagesReminderEmail');

module.exports.request = {
    type: 'get',
    path: '/crons/:cron_name'
};

const paramSchema = new Schema({
    cron_name: {
        type: String,
        enum: ['sync_sendgrid', 'company_auto_email', 'unread_chat', 'new_messages_email']
    }
});

const querySchema = new Schema({
    company_id: String
});


module.exports.inputValidation = {
    params: paramSchema,
    query: querySchema
};

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    const cronName = req.params.cron_name;

    let result;

    switch(cronName) {
        case "sync_sendgrid":
            result = await cronSyncSendgrid();
            break;
        case "company_auto_email":
            if (req.query && req.query.company_id) {
                result = await cronCompanyAutoEmail(req.query.company_id);
            } else {
                result = await cronCompanyAutoEmail();
            }
            break;
        case "unread_chat":
            result = await cronUnreadChat();
            break;
        case "new_messages_email":
            result = await cronNewMessages();
            break;
        default:
            errors.throwError("Cron name not found", 400)
    }

    res.json({
        result: result
    })
}