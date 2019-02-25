const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    totalDocsToProcess = await companies.count({saved_searches : { $exists: true, $ne : [] }});
    logger.debug(totalDocsToProcess);

    await companies.findAndIterate({saved_searches : { $exists: true, $ne : [] }}, async function(companyDoc) {
        totalProcessed++;
        console.log("company doc id: " + companyDoc._id);
        let set = {};
        let unset = {};
        set.search_name = 'Job search';
        set.when_receive_email_notitfications = companyDoc.saved_searches[0].when_receive_email_notitfications;
        unset.saved_searches[0].when_receive_email_notitfications = 1;

        await companies.update({_creator : companyDoc._creator},{$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

module.exports.down = async function() {

}
