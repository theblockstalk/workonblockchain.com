const settings = require('./settings');
const unreadChatMessages = require('./controller/services/cron/unreadChatMessagesReminder');
const autoNotification = require('./controller/services/cron/companyAutomaticEmailOfNewCandidate');
const logger = require('./controller/services/logger');
const cron = require('cron');

const CronJob = cron.CronJob;

module.exports.startCron = function startCron() {
    const unreadMessagesJob = new CronJob({
        cronTime: settings.CRON.UNREAD_MESSAGES_TICK,
        onTick: function() {
            unreadChatMessages();
            autoNotification();
        },
        start: true,
        timeZone: 'CET'
    });
    logger.debug('unreadMessagesJob', {job: unreadMessagesJob});

    logger.info('Cron jobs started');
}