const company = require('../model/mongoose/company');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalProcessed = 0;

module.exports.up = async function() {
    totalDocsToProcess =await company.count({"candidates_sent_by_email.sent": { $gte : ISODate("2019-02-07T00:00:00.000+0000")} });
    logger.debug(totalDocsToProcess);

    await company.updateMany({"candidates_sent_by_email.sent": { $gte : ISODate("2019-02-06T00:00:00.000+0000")} },
        {$pull: { candidates_sent_by_email: {sent: { $gte : ISODate("2019-02-06T00:00:00.000+0000")}}}});

    console.log('Total documents: ' + totalDocsToProcess);
    console.log('Total processed users: ' + totalProcessed);
}

module.exports.down = async function() {

}
