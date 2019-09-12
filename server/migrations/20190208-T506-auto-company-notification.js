const company = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalProcessed = 0;

module.exports.up = async function() {
    totalDocsToProcess =await company.count({"candidates_sent_by_email.sent": { $gte : new Date("2019-02-06")} });
    logger.debug(totalDocsToProcess);

    await company.updateMany({"candidates_sent_by_email.sent": {$gte: new Date("2019-02-06")}},
        {$pull: {candidates_sent_by_email: {sent: {$gte: new Date("2019-02-06")}}}});

    console.log('Total documents: ' + totalDocsToProcess);
    console.log('Total processed users: ' + totalProcessed);
}

module.exports.down = async function() {

}
