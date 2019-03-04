const settings = require('./settings');
const unreadChatMessages = require('./controller/services/cron/unreadChatMessagesReminder');
const autoNotification = require('./controller/services/cron/companyAutomaticEmailOfNewCandidate');
const synchronizeSendGrid = require('./controller/services/cron/synchronizeSendGrid');
const logger = require('./controller/services/logger');
const cron = require('cron');

const CronJob = cron.CronJob;

module.exports.startCron = function startCron() {
    if (settings.isLiveApplication()) {
        const unreadMessagesJob = new CronJob({
            cronTime: settings.CRON.UNREAD_MESSAGES_TICK,
            onTick: function() {
                Promise.resolve(unreadChatMessages()).catch(function (error) {
                    logger.error(error.message, {
                        stack: error.stack,
                        name: error.name
                    });
                });
            },
            start: true,
            timeZone: 'CET'
        });

        const syncSendgrid = new CronJob({
            cronTime: settings.CRON.SYNC_SENDGRID,
            onTick: function() {
                Promise.resolve(synchronizeSendGrid()).catch(function (error) {
                    logger.error(error.message, {
                        stack: error.stack,
                        name: error.name
                    });
                });
            },
            start: true,
            timeZone: 'CET'
        });

         const autoNotificationEmail = new CronJob({
             cronTime: settings.CRON.AUTO_NOTIFICATION,
             onTick: function() {
                 Promise.resolve(autoNotification()).catch(function (error) {
                     logger.error(error.message, {
                         stack: error.stack,
                         name: error.name
                     });
                 });
             },
             start: true,
             timeZone: 'CET'
         });

        logger.debug('Cron jobs', {
            unreadMessagesJob: unreadMessagesJob,
            syncSendgridJob: syncSendgrid,
            autoNotification : autoNotificationEmail
        });

        logger.info('Cron jobs started');
    }
}