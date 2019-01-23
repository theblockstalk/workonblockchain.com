const users = require('../model/mongoose/users');
const cities = require('../model/cities');
const enumeration =  require('../model/enumerations');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');
const csv=require('csvtojson');
const csvFilePath='C:\\Users\\DELL\\Downloads\\worldcities - processed.csv';

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;
let newDocs= 0, totalIncompleteDoc= 0;

csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
})


module.exports.up = async function() {
    const locationsJsonArray=await csv().fromFile(csvFilePath);
    console.log("Total no location in csv: " +locationsJsonArray.length)

    for(let location of locationsJsonArray) {
        let data = {
            city : location.city,
            country : location.country,
            active : true,
        }
        logger.debug("cities document: ", data);
        let newDoc = new cities(data);

        await newDoc.save();
        newDocs++;
    }
    console.log("No of locations added in cities collection: " + newDocs);

    totalDocsToProcess =await users.count({type : 'candidate'});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        let countryList = {};
        let countries = {} ;
        let citiesId = {};
        let locations=[];
        if(userDoc.candidate.locations) {
            console.log("candidate Doc id: " + userDoc._id);
            console.log("candidate Doc locations:  " + userDoc.candidate.locations);

            /// find in cities collection
            const citiesDoc = await cities.find({city :  {$in: userDoc.candidate.locations}}).lean();
            if(citiesDoc) {
                for(let cities of citiesDoc) {
                    citiesId = {
                        city : cities._id,
                        visa_not_needed : false,
                    }
                    locations.push(citiesId);
                }
            }

            for(let loc of userDoc.candidate.locations) {
                if(loc === 'remote') {
                    locations.push({remote:true, visa_not_needed: false});
                }
            }
            const countriesEnum = enumeration.countries;
            if(userDoc.candidate.base_country) {
                if(countriesEnum.find(x => x === userDoc.candidate.base_country)) {
                    locations.push({country: userDoc.candidate.base_country, visa_not_needed : true});
                }
            }

            if(locations && locations.length > 0) {
                await users.update({ _id: userDoc._id },{ $set: {'candidate.locations' : locations} });
                totalModified++;
            }

        }
        else {
            totalIncompleteDoc++;
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user document with incomplete profile: ' + totalIncompleteDoc);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}

module.exports.down = async function() {


}