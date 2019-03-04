const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    totalDocsToProcess = await users.count({'candidate.status' : { $exists: true, $ne : [] }});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({'candidate.status' : { $exists: true, $ne : [] }}, async function(userDoc) {
        totalProcessed++;
        logger.debug("user doc id: " , userDoc._id);
        let set = {};
        let unset = {};
        let statusHistory = [];
        for(let status of userDoc.candidate.status) {
            statusHistory.push({status : status})
        }
        set['candidate.history'] = statusHistory;
        unset['candidate.status'] = 1;
        await users.update({_id : userDoc._id},{$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

module.exports.down = async function() {
    totalDocsToProcess = await users.count({'candidate.history.status' : { $exists: true, $ne : [] }});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({'candidate.history.status' : { $exists: true, $ne : [] }}, async function(userDoc) {
        totalProcessed++;
        logger.debug("user doc id: " , userDoc._id);
        let set = {};
        let unset = {};
        let statusHistory = [];
        for(let history of userDoc.candidate.history) {
            if(history.status) {
                statusHistory.push(history.status);
            }
        }
        set['candidate.status'] = statusHistory;
        unset['candidate.history'] = 1;
        await users.update({_id : userDoc._id},{$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}
