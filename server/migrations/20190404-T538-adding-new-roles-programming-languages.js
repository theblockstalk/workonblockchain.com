const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const cities = require('../model/mongoose/cities');
const objects = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await cities.count();
    logger.debug(totalDocsToProcess);

    await cities.findAndIterate({}, async function(cityDoc) {
        let updateObj = {};
        if (cityDoc.country === 'Congo {Democratic Rep}') {
            console.log(cityDoc.country);
            logger.debug("processing city doc: ", {Id: cityDoc._id});
            updateObj['country'] = "Congo";
        }
        if (cityDoc.country === 'Ireland {Republic}') {
            console.log(cityDoc.country);
            logger.debug("processing user doc: ", {Id: cityDoc._id});
            updateObj['country'] = "Ireland";
        }
        if (cityDoc.country === 'Myanmar, {Burma}') {
            console.log(cityDoc.country);
            logger.debug("processing user doc: ", {Id: cityDoc._id});
            updateObj['country'] = "Myanmar (Burma)";
        }
        if (!objects.isEmpty(updateObj)) {
            logger.debug("migrate city doc", updateObj);
            await cities.update({_id: cityDoc._id}, {$set : updateObj});
            totalModified++;
        }
    });

    totalDocsToProcess=0;
    totalModified = 0;
    totalDocsToProcess = await users.count();
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({}, async function(userDoc) {
        if(userDoc.type === 'candidate'){
            let updateObj = {};
            if(userDoc.candidate.locations){
                for (let loc of userDoc.candidate.locations) {
                    if (loc.country) {
                        let index = userDoc.candidate.locations.findIndex((
                            obj => obj.country === 'Congo {Democratic Rep}'
                        ));
                        if(index >= 0) {
                            userDoc.candidate.locations[index].country = 'Congo';
                        }

                        index = userDoc.candidate.locations.findIndex((
                            obj => obj.country === 'Ireland {Republic}'
                        ));
                        if(index >= 0) {
                            userDoc.candidate.locations[index].country = 'Ireland';
                        }

                        index = userDoc.candidate.locations.findIndex((
                            obj => obj.country === 'Myanmar, {Burma}'
                        ));
                        if(index >= 0) {
                            userDoc.candidate.locations[index].country = 'Myanmar (Burma)';
                        }
                    }
                }
                updateObj['candidate.locations'] = userDoc.candidate.locations;
            }

            if(userDoc.nationality && (userDoc.nationality === 'Dutchman' || userDoc.nationality === 'Dutchwoman' ||
                userDoc.nationality === 'Netherlander')){
                console.log(userDoc.nationality);
                logger.debug("processing user doc: ", {userId: userDoc._id});
                updateObj['nationality'] = "Dutch";
            }

            if(userDoc.candidate && userDoc.candidate.base_country) {
                if (userDoc.candidate.base_country === 'Congo {Democratic Rep}') {
                    console.log(userDoc.candidate.base_country);
                    logger.debug("processing user doc: ", {userId: userDoc._id});
                    updateObj['candidate.base_country'] = "Congo";
                }
                if (userDoc.candidate.base_country === 'Ireland {Republic}') {
                    console.log(userDoc.candidate.base_country);
                    logger.debug("processing user doc: ", {userId: userDoc._id});
                    updateObj['candidate.base_country'] = "Ireland";
                }
                if (userDoc.candidate.base_country === 'Myanmar, {Burma}') {
                    console.log(userDoc.candidate.base_country);
                    logger.debug("processing user doc: ", {userId: userDoc._id});
                    updateObj['candidate.base_country'] = "Myanmar (Burma)";
                }
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
            if(companyDoc) {
                if (companyDoc.company_country === 'Congo {Democratic Rep}') {
                    console.log(companyDoc.company_country);
                    logger.debug("processing company doc: ", {userId: companyDoc._id});
                    updateObj['company_country'] = "Congo";
                }
                if (companyDoc.company_country === 'Ireland {Republic}') {
                    console.log(companyDoc.company_country);
                    logger.debug("processing company doc: ", {userId: companyDoc._id});
                    updateObj['company_country'] = "Ireland";
                }
                if (companyDoc.company_country === 'Myanmar, {Burma}') {
                    console.log(companyDoc.company_country);
                    logger.debug("processing company doc: ", {userId: companyDoc._id});
                    updateObj['company_country'] = "Myanmar (Burma)";
                }
                if (!objects.isEmpty(updateObj)) {
                    logger.debug("migrate company doc", updateObj);
                    await companies.update({_id: companyDoc._id}, {$set: updateObj});
                    totalModified++;
                }
            }
        }

    });
    logger.debug("total user doc processed", {total: totalModified});
}

// This function will undo the migration
module.exports.down = async function() {
    //There will be no down migration
}