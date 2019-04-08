const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const objects = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count();
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({}, async function(userDoc) {
        if(userDoc.type === 'candidate'){
            let updateObj = {};
            if(userDoc.nationality && (userDoc.nationality === 'Dutchman' || userDoc.nationality === 'Dutchwoman' ||
                userDoc.nationality === 'Netherlander')){
                console.log(userDoc.nationality);
                logger.debug("processing user doc: ", {userId: userDoc._id});
                updateObj['nationality'] = "Dutch";
            }

            if(userDoc.candidate.base_country && userDoc.candidate.base_country === 'Congo {Democratic Rep}'){
                console.log(userDoc.candidate.base_country);
                logger.debug("processing user doc: ", {userId: userDoc._id});
                updateObj['candidate.base_country'] = "Congo";
            }
            else if(userDoc.candidate.base_country && userDoc.candidate.base_country === 'Ireland {Republic}'){
                console.log(userDoc.candidate.base_country);
                logger.debug("processing user doc: ", {userId: userDoc._id});
                updateObj['candidate.base_country'] = "Ireland";
            }
            else if(userDoc.candidate.base_country && userDoc.candidate.base_country === 'Myanmar, {Burma}'){
                console.log(userDoc.candidate.base_country);
                logger.debug("processing user doc: ", {userId: userDoc._id});
                updateObj['candidate.base_country'] = "Myanmar (Burma)";
            }

            if (!objects.isEmpty(updateObj)) {
                logger.debug("migrate user doc", updateObj);
                await users.update({_id: userDoc._id}, {$set : updateObj});
                totalModified++;
            }
        }
        else{
            let updateObj = {};
            const companyDoc = await companies.findOne({ _creator: userDoc._id });
            if(companyDoc.company_country === 'Congo {Democratic Rep}'){
                console.log(companyDoc.company_country);
                logger.debug("processing company doc: ", {userId: companyDoc._id});
                updateObj['company_country'] = "Congo";
            }
            else if(companyDoc.company_country === 'Ireland {Republic}'){
                console.log(companyDoc.company_country);
                logger.debug("processing company doc: ", {userId: companyDoc._id});
                updateObj['company_country'] = "Ireland";
            }
            else if(companyDoc.company_country === 'Myanmar, {Burma}'){
                console.log(companyDoc.company_country);
                logger.debug("processing company doc: ", {userId: companyDoc._id});
                updateObj['company_country'] = "Myanmar (Burma)";
            }
            if (!objects.isEmpty(updateObj)) {
                logger.debug("migrate company doc", updateObj);
                await companies.update({_id: companyDoc._id}, {$set : updateObj});
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