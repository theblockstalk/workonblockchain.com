const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const fs = require("fs");
const log = require('log-to-file');

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    let totalCount = 0;
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
        //console.log(userDoc.candidate.history[0].status);
        if(!userDoc.candidate.history[0].timestamp || !userDoc.candidate.latest_status.timestamp){
            totalCount++;
            const data = 'it has no timestamp ['+totalCount+']: '+ userDoc._id;
            console.log(data);
            log(data, 'my-log.log');
        }
    });

    console.log("total: " + totalCount);
}

// This function will undo the migration
module.exports.down = async function() {
    //nothing to do
}