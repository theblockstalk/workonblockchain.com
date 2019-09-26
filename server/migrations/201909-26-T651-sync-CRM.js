const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/companies');
const syncQueue = require('../model/mongoose/sync_queue');
const logger = require('../controller/services/logger');
const syncService = require('../controller/services/serviceSync');

let totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0, totalErrors=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({});
    console.log('Total users: ' + totalDocsToProcess);

    await users.findAndIterate({}, async function (userDoc) {
        let obj = { user: userDoc};
        let logObj = {_id: userDoc._id};

        if (userDoc.type === "company") {
            const companyDoc = await companies.findOne({_creator: userDoc._id});
            if (!companyDoc) {
                logger.error("Commpany was not found for user: " + userDoc._id);
                totalErrors++;
            }
            else {
                logObj.company_id = companyDoc._id;
                obj.company = companyDoc;
            }
        }
        logger.debug("User was added to the sync queue", logObj);
        totalProcessed++;
        await syncService.pushToQueue("POST", obj);
    })
    console.log('Users added to queue: ' + totalProcessed);
    console.log('Errors while adding to queue: ' + totalErrors);

    const queueSize = await syncQueue.count({status: "pending", operation: "POST"});
    console.log('Items in queue: ' + queueSize);

    // THIS CANNOT BE DONE AS settings.ENVIRONMENT IS NOT RIGHT. MUST WAIT FOR THE SERVER TO SYNC THEM
    // for (let i = 0; i < queueSize; i+=100) {
    //     console.log('Pulling items from queue");
    //     await syncService.pullFromQueue()
    // }
}

// This function will undo the migration
module.exports.down = async function() {
}