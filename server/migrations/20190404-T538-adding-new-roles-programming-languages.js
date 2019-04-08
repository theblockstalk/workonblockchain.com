const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const object = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    let set = {};
    totalDocsToProcess = await users.count();
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({}, async function(candDoc) {
        if(candDoc.type === 'candidate'){
            let updateObj = {};
            if(candDoc.nationality === 'Dutchman' || candDoc.nationality === 'Dutchwoman' ||
                candDoc.nationality === 'Netherlander'){
                console.log(candDoc.nationality);
                logger.debug("processing user doc: ", {userId: candDoc._id});
                set = {
                    nationality: "Dutch"
                };
                updateObj = {$set: set};
            }
            if(candDoc.candidate.base_country === 'Congo {Democratic Rep}'){
                console.log(candDoc.candidate.base_country);
                logger.debug("processing user doc: ", {userId: candDoc._id});
                set = {
                    "candidate.base_country": "Congo"
                };
                updateObj = {$set: set};
            }

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