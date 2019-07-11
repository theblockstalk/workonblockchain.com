const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const fs = require("fs");
const log = require('log-to-file'); //only for local usage

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
        //console.log(userDoc.candidate.history[0].status);
        totalProcessed++;
        if(!userDoc.candidate.history[0].timestamp || !userDoc.candidate.latest_status.timestamp){
            const data = 'it has no timestamp ['+totalModified+']: '+ userDoc._id;
            console.log(data);
            console.log(userDoc.candidate.history[0].timestamp);
            //process.exit();
            let set = {};
            set['candidate.latest_status.timestamp'] = userDoc.candidate.history[0].timestamp;
            logger.debug("set object: " , set);

            await users.update({_id : userDoc._id},{$set : set});
            totalModified++;

            log(data, 'T631.log'); //only for local usage
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    //nothing to do
}