const users = require('../model/mongoose/users');
const cities = require('../model/cities');
const enumeration =  require('../model/enumerations');
const mongoose = require('mongoose');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;
let newDocs =0;

const csvFilePath='C:\\Users\\DELL\\Downloads\\worldcities - processed.csv';
const csv=require('csvtojson');
csv()
    .fromFile(csvFilePath)
    .then((jsonObj) => {
})

function removeDuplicates(originalArray, prop) {
    let newArray = [];
    let lookupObject  = {};

    for(let i in originalArray) {
        lookupObject[originalArray[i][prop]] = originalArray[i];
    }

    for(i in lookupObject) {
        newArray.push(lookupObject[i]);
    }
    return newArray;
}

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

    await users.findAndIterate({type : 'candidate'}, async function(candidateDoc) {
        totalProcessed++;
        let countryList = {};
        let countries = {} ;
        let citiesId = {};
        let locations=[];
        if(candidateDoc.candidate.locations) {
            console.log("candidate Doc id: " + candidateDoc._id);
            console.log("candidate Doc locations:  " + candidateDoc.candidate.locations);

            /// find in cities collection
            const citiesDoc = await cities.find({city :  {$in: candidateDoc.candidate.locations}}).lean();
            if(citiesDoc) {
                for(let cities of citiesDoc) {
                    citiesId = {
                        city : cities._id,
                        visa_not_needed : false,
                    }
                    locations.push(citiesId);
                }
            }

            /// find in countries enumeration
            const countriesEnum = enumeration.countries;
            for(let country of candidateDoc.candidate.locations) {
                if(countriesEnum.find(x => x === country)) {
                    countries = {
                        country : country,
                        visa_not_needed : false,
                    };
                    locations.push(countries);
                }
            }

            //find countries in cities collection
            const citiesCountryDoc = await cities.find({country :  {$in: candidateDoc.candidate.locations}}).lean();
            if(citiesCountryDoc) {
                for(let countries of citiesCountryDoc) {
                    countryList = {
                        country : countries.country,
                        visa_not_needed : false,
                    }
                    locations.push(countryList);
                }

            }

            if(locations && locations.length > 0) {
                locations = removeDuplicates(locations, "country");
                await users.update({ _id: candidateDoc._id },{ $set: {'candidate.locations' : locations} });
                totalModified++;
            }

        }
    });

    console.log('Total candidate document to process: ' + totalDocsToProcess);
    console.log('Total processed document: ' + totalProcessed);
    console.log('Total modified document: ' + totalModified);
}

module.exports.down = async function() {


}