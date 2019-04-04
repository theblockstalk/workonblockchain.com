const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const object = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    let set = {};
    totalDocsToProcess = await users.count({type:'candidate',"candidate.blockchain": {$exists: true}});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type:'candidate',"candidate.blockchain": {$exists: true}}, async function(candDoc) {
        if(candDoc.nationality === 'Dutchman' || candDoc.nationality === 'Dutchwoman' ||
            candDoc.nationality === 'Netherlander'){
            logger.debug("processing user doc: ", {userId: candDoc._id});
            set = {
                nationality: "Dutch"
            };
            let updateObj = {$set: set};
            if (updateObj) {
                logger.debug("migrate user doc", set);
                await users.update({_id: candDoc._id}, updateObj);
                totalModified++;
            }
        }
    });
    logger.debug("total user doc processed", {total: totalModified});
}

// This function will undo the migration
module.exports.down = async function() {
    //There will be no down migration
}