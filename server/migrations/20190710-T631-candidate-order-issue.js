const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const fs = require("fs");

const { promisify } = require("util");
const writeFile = promisify(fs.writeFile);

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
        //console.log(userDoc.candidate.history[0].status);
        if(userDoc.candidate.history[0].timestamp && userDoc.candidate.latest_status.timestamp){
            console.log('both there');
        }
        else{
            console.log('it has no: ' + userDoc._id);
            await saveToFile().catch(error => console.error(error));
            //await saveToFile(userDoc._id);
        }

        /*if(userDoc.candidate.history[0].timestamp.getTime() === userDoc.candidate.latest_status.timestamp.getTime()){}
        else {
            console.log('not equal');
            console.log(userDoc.candidate.history[0].timestamp);
            console.log(userDoc.candidate.latest_status.timestamp);
        }*/
        //console.log(userDoc.candidate.latest_status.timestamp);
        //process.exit();
    });
}

const saveToFile = async function saveToFile(userID) {
    let data = "ID which has no timestamp: " + userID;
    await writeFile("ids.txt",data);

    console.info("file created successfully with promisify and async/await!");

    /*await fs.writeFile("temp.txt", data, (err) => {
        if (err) console.log(err);
        else {
            console.log("Successfully Written to File.");
            process.exit();
        }
    });*/
}

// This function will undo the migration
module.exports.down = async function() {
    //nothing to do
}