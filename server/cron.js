const settings = require('./settings');
const logger = require('./controller/services/logger');
const cron = require('cron');

const unreadChatMessages = require('./controller/services/cron/unreadChatMessagesReminder');
const autoNotification = require('./controller/services/cron/companyAutomaticEmailOfNewCandidate');
const synchronizeSendGrid = require('./controller/services/cron/synchronizeSendGrid');
const newMessagesEmail = require('./controller/services/cron/newMessagesReminderEmail');
const serviceQueueCron = require('./controller/services/cron/serviceQueue');

const CronJob = cron.CronJob;

module.exports.startCron = function startCron() {
    if (settings.isLiveApplication()) {
        const newMessagesJob = createCronJob(settings.CRON.NEW_MESSAGES_EMAIL, newMessagesEmail);

        const unreadMessagesJob = createCronJob(settings.CRON.UNREAD_MESSAGES_TICK, unreadChatMessages);

        const syncSendgrid = createCronJob(settings.CRON.SYNC_SENDGRID, synchronizeSendGrid);

        const autoNotificationEmail = createCronJob(settings.CRON.AUTO_NOTIFICATION, autoNotification);

        const serviceQueue = createCronJob(settings.CRON.SERVICE_QUEUE, serviceQueueCron);

        logger.debug('Cron jobs', {
            newMessagesJob: newMessagesJob,
            unreadMessagesJob: unreadMessagesJob,
            syncSendgridJob: syncSendgrid,
            autoNotification : autoNotificationEmail,
            serviceQueue: serviceQueue
        });

        logger.info('Cron jobs started');
    }
};

const createCronJob = function (cronTime, cronFunction) {
    return new CronJob({
        cronTime: cronTime,
        onTick: logOnError(cronFunction),
        start: true,
        timeZone: 'CET'
    })
};

const logOnError = function(fn) {
    return Promise.resolve(fn()).catch(function (error) {
        logger.error(error.message, {
            stack: error.stack,
            name: error.name
        });
    });
};