const Slack = require('slack-node');
const settings = require('../../settings');
const logger = require('./logger');

let slack;

// if (settings.isLiveApplication()) {
    webhookUri = "__uri___";
    slack = new Slack();
    // slack.setWebhook(settings.SLACK_WEBHOOK);
    slack.setWebhook('https://hooks.slack.com/services/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');
// }

module.exports.reportBug = function reportBug(bug) {

    // if (settings.isLiveApplication()) {
        try {
            slack.webhook({
                channel: "#1_wob_server_bugs",
                text: "BUG ON " + settings.ENVIRONMENT.toUpperCase() + "\n url: " + bug.url + "\nmethod: " + bug.method + "\nRequestId: "
                + bug.requestID + "\nStack: " + bug.stack,
            }, function(err, response) {
                if(err) {
                    logger.error("Slack error", err);
                } else {
                    logger.debug("Slack success", response);
                }
            });
        } catch (e) {
            logger.error("Unable to report slack bug!", e)
        }
    // }
};