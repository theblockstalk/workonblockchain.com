const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const objects = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type: 'candidate'});
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    let noHistor0moreLatest=0, minLatest0MoreHistory1, minLatest0MoreHistory2;

    await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
        let set = {};
        totalProcessed++;

        if (userDoc.candidate.latest_status.timestamp && userDoc.candidate.history[0].timestamp.getTime() > userDoc.candidate.latest_status.timestamp.getTime()) {
            noHistor0moreLatest++;
            minLatest0MoreHistory1 = Math.min(userDoc.candidate.history[0].timestamp, userDoc.candidate.latest_status.timestamp);
            minLatest0MoreHistory2 = Math.min(userDoc.candidate.latest_status.timestamp, userDoc.candidate.history[0].timestamp);
            set['candidate.latest_status.timestamp'] = userDoc.candidate.history[0].timestamp;
        }

        if(!userDoc.candidate.history[0].timestamp || !userDoc.candidate.latest_status.timestamp){
            totalModified++;
            set['candidate.latest_status.timestamp'] = userDoc.candidate.history[0].timestamp;
        }

        if(!objects.isEmpty(set)) {
            console.log(set);
            console.log(userDoc._id);
            await users.update({_id: userDoc._id}, {$set: set});
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
    console.log('noHistor0moreLatest: ' + noHistor0moreLatest);
}

// This function will undo the migration
module.exports.down = async function() {
    //nothing to do
}