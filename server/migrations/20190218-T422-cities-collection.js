const users = require('../model/mongoose/users');
const cities = require('../model/mongoose/cities');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    totalDocsToProcess = await users.count({type : 'candidate', "candidate.locations.city": { $exists: true}});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type : 'candidate', "candidate.locations.city": { $exists: true}}, async function(userDoc) {
        totalProcessed++;
        console.log("000user id: " + userDoc._id);
        const locations = userDoc.candidate.locations;
        console.log("  111locations:  " + JSON.stringify(locations, null, 1));

        let locationCountries = locations.map(function(location) {
            if (location.country) return location.country;
        });

        let updated = false;
        for (let location of locations) {
            if (location.city && location.visa_needed) {
                const city = await cities.findOneById(location.city);

                if (locationCountries.includes(city.country)) {
                    console.log("  222", JSON.stringify({_id: userDoc._id, "candidate.locations._id": location._id}, null, 1),
                        JSON.stringify({$set: {"candidate.locations.$.visa_needed": false}}, null, 1));
                    await users.update({_id: userDoc._id, "candidate.locations._id": location._id},
                        {$set: {"candidate.locations.$.visa_needed": false}});
                    updated = true;
                }
            }
        }
        let userAfter = await users.findOneById(userDoc._id);
        console.log("  333locations after:  " + JSON.stringify(userAfter.candidate.locations, null, 1));

        if (updated) totalModified++;
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

module.exports.down = async function() {
    // no way to reverse this
}
