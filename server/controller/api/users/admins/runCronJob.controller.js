const cronSyncSendgrid = require('../../../services/cron/synchronizeSendGrid');
const cronCompanyAutoEmail = require('../../../services/cron/companyAutomaticEmailOfNewCandidate');
const cronUnreadChat = require('../../../services/cron/unreadChatMessagesReminder');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {

    const cronName = req.params.cron_name;

    let result;

    switch(cronName) {
        case "syncSendgrid":
            result = await cronSyncSendgrid();
            break;
        case "companyAutoEmail":
            result = await cronCompanyAutoEmail();
            break;
        case "ureadChat":
            result = await cronUnreadChat();
            break;
        default:
            errors.throwError("Cron name not found", 400)
    }

    res.json({
        success: true,
        result: result
    })
}

