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
        for(let userStatus of userDoc.candidate.status) {
            let status = {};
            if(userStatus.status) status.status = userStatus.status;
            if(userStatus.reason) status.reason = userStatus.reason;

            statusHistory.push({status : status, timestamp: new Date()})
        }
        set['candidate.history'] = statusHistory;

        let latestStatus = {};
        if(statusHistory[0].status.status) latestStatus.status = statusHistory[0].status.status;
        if(statusHistory[0].status.reason) latestStatus.reason = statusHistory[0].status.reason;
        latestStatus.timestamp = new Date();
        set['candidate.latest_status'] = latestStatus;

        unset['candidate.status'] = 1;

        logger.debug("set object: " , set);

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
        unset['candidate.latest_status'] = 1;

        logger.debug("set object: " , set);

        await users.update({_id : userDoc._id},{$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}
