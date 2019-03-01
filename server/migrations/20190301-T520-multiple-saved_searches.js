const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    totalDocsToProcess = await companies.count({saved_searches : { $exists: true, $ne : [] }});
    logger.debug(totalDocsToProcess);

    await companies.findAndIterate({saved_searches : { $exists: true, $ne : [] }}, async function(companyDoc) {
        totalProcessed++;
        logger.debug("company doc id: " , companyDoc._id);
        let saved_searches = companyDoc.saved_searches;
        let timestamp = new Date();
        for (let search of saved_searches) {
            if (!search.timestamp) search.timestamp = timestamp;
            if(search.position) {
                let roles = [];
                for (let roleValue of search.position ) {
                    if(roleValue === 'Researcher ') roles.push('Researcher');
                    else roles.push(roleValue);
                }

                search.position = roles;
            }

        }
        let set = {$set : {saved_searches: saved_searches}};
        logger.debug("set object" , set);
        await companies.update({_id : companyDoc._id}, set);
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

module.exports.down = async function() {

    totalDocsToProcess = await companies.count({saved_searches : { $exists: true, $ne : [] }});
    logger.debug(totalDocsToProcess);

    await companies.updateMany({saved_searches : { $exists: true, $ne : [] }}, {$unset: {"saved_searches.timestamp": 1}})

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}
