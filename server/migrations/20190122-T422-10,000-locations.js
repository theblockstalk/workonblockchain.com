const users = require('../model/mongoose/users');
const cities = require('../model/mongoose/cities');
const enumeration =  require('../model/enumerations');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');
const csv=require('csvtojson');
const citiesFilePath = __dirname + '/cities-csv/worldcities-processed.csv';
const nationalityFilePath = __dirname + '/cities-csv/worldcities-processed-nationalities.csv';

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;
let newDocs= 0, totalIncompleteDoc= 0;

module.exports.up = async function() {
    const locationsJsonArray=await csv().fromFile(citiesFilePath);
    console.log("Total no location in csv: " +locationsJsonArray.length)

    for(let location of locationsJsonArray) {
        let data = {
            city : location.city,
            country : location.country,
            active : true,
        }
        logger.debug("cities document: ", data);
        await cities.insert(data);
        newDocs++;
    }
    console.log("No of locations added in cities collection: " + newDocs);

    totalDocsToProcess =await users.count({type : 'candidate'});
    logger.debug(totalDocsToProcess);

    //process nationality csv
    const nationalityJsonArray=await csv().fromFile(nationalityFilePath);
    logger.debug("Nationality document object: ", nationalityJsonArray);

    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        let locations=[];
        if(userDoc.candidate.locations) {
            console.log("candidate Doc id: " + userDoc._id);
            console.log("candidate Doc locations:  " + userDoc.candidate.locations);

            /// find in cities collection
            await cities.findAndIterate({city :  {$in: userDoc.candidate.locations}}, async function(citiesDoc) {
                locations.push({city: citiesDoc._id, visa_not_needed: true});
            });

            for(let loc of userDoc.candidate.locations) {
                if(loc === 'remote') {
                    locations.push({remote:true, visa_not_needed: false});
                }
            }

            //base_country
            const countriesEnum = enumeration.countries;
            if(userDoc.candidate.base_country) {
                if(countriesEnum.find(x => x === userDoc.candidate.base_country)) {
                    locations.push({country: userDoc.candidate.base_country, visa_not_needed : true});
                }
            }

            //nationality
            if(userDoc.nationality) {
                for(let loc of nationalityJsonArray) {
                    const checkCountryExists = obj =>obj.country === loc.Country;
                    if(loc.Nationality === userDoc.nationality && locations.some(checkCountryExists) === false) {
                        locations.push({country: loc.Country, visa_not_needed : true});
                    }
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

    totalDocsToProcess =await users.count({type : 'candidate'});
    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        let locations = [];
        totalProcessed++;

        console.log("candidate Doc id: " + userDoc._id);
        logger.debug("candidate Doc locations:  ", userDoc.candidate.locations);

        if(userDoc.candidate.locations) {
            for(let loc of userDoc.candidate.locations) {
                if(loc.city){
                    const cityDoc= await cities.findOneById(loc.city);
                    locations.push(cityDoc.city);
                }
                if(loc.remote === true) {
                    locations.push("remote");
                }
            }

            await users.update({ _id: userDoc._id },{ $set: {'candidate.locations' : locations} });
            totalModified++;

        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}
