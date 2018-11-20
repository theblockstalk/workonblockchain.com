const sendGrid = require('../email/sendGrid');
const logger = require('../logger');

module.exports = function async () {
    let customFields = await sendGrid.getAllLists();

    console.log(customFields);

    logger.info('Synchronized all users to Sendgrid', {timestamp: Date.now()});
};