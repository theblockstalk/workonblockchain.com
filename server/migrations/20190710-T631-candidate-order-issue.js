const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const fs = require("fs");
const log = require('log-to-file'); //only for local usage

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);

    let noHistor0Timestamp = 0, minHistory0Timestamp, noHistor0moreLatest=0;
    let minLatest0MoreHistory1, minLatest0MoreHistory2, minHistory0moreLatest2, latestStatustimestampGT=0;
    let minHistory0moreLatest1, equalTimestamp = 0;

    await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
        //console.log(userDoc.candidate.history[0].status);
        totalProcessed++;
        //if(userDoc.candidate.history[0].timestamp.getTime() > (userDoc.candidate.latest_status.timestamp && userDoc.candidate.latest_status.timestamp.getTime())){
        if (!userDoc.candidate.history[0].timestamp) {
            noHistor0Timestamp++;
            minHistory0Timestamp = Math.min(userDoc.candidate.history[0].timestamp, userDoc.candidate.latest_status.timestamp)
            console.log(minHistory0Timestamp);
        }
        if (userDoc.candidate.latest_status.timestamp && userDoc.candidate.history[0].timestamp.getTime() > userDoc.candidate.latest_status.timestamp.getTime()) {
            noHistor0moreLatest++;
            minLatest0MoreHistory1 = Math.min(userDoc.candidate.history[0].timestamp, userDoc.candidate.latest_status.timestamp);
            minLatest0MoreHistory2 = Math.min(userDoc.candidate.latest_status.timestamp, userDoc.candidate.history[0].timestamp);
            //const data = 'minLatest0MoreHistory2: '+minLatest0MoreHistory2+', minLatest0MoreHistory1: '+minLatest0MoreHistory1+', ID: '+userDoc._id+', latest_status.timestamp: '+userDoc.candidate.latest_status.timestamp+'*** history[0].timestamp: '+userDoc.candidate.history[0].timestamp;
            //log(data, 'T631_more_history0.log'); //only for local usage
        }
        if (userDoc.candidate.latest_status.timestamp && userDoc.candidate.latest_status.timestamp.getTime() > userDoc.candidate.history[0].timestamp.getTime()) {
            latestStatustimestampGT++;
            //const data = 'ID: '+userDoc._id+', latest_status.timestamp: '+userDoc.candidate.latest_status.timestamp+'*** history[0].timestamp: '+userDoc.candidate.history[0].timestamp;
            //log(data, 'T631_more_latest_status.log'); //only for local usage
            minHistory0moreLatest1 = Math.min(userDoc.candidate.history[0].timestamp, userDoc.candidate.latest_status.timestamp);
            minHistory0moreLatest2 = Math.min(userDoc.candidate.latest_status.timestamp, userDoc.candidate.history[0].timestamp);
        }
        if(userDoc.candidate.latest_status.timestamp && userDoc.candidate.latest_status.timestamp.getTime() === userDoc.candidate.history[0].timestamp.getTime()){
            equalTimestamp++;
        }
        if(!userDoc.candidate.history[0].timestamp || !userDoc.candidate.latest_status.timestamp){
            const data = 'it has no timestamp ['+totalModified+']: '+ userDoc._id;
            console.log(data);
            console.log(userDoc.candidate.history[0].timestamp);
            //process.exit();
            /*let set = {};
            set['candidate.latest_status.timestamp'] = userDoc.candidate.history[0].timestamp;
            logger.debug("set object: " , set);

            await users.update({_id : userDoc._id},{$set : set});*/
            totalModified++;

            //log(data, 'T631.log'); //only for local usage
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
    console.log('minHistory0Timestamp: ' + noHistor0Timestamp);
    console.log('noHistor0moreLatest: ' + noHistor0moreLatest);
    console.log('latestStatustimestampGT: ' + latestStatustimestampGT);
    console.log('equalTimestamp: ' + equalTimestamp);
}

// This function will undo the migration
module.exports.down = async function() {
    //nothing to do
}