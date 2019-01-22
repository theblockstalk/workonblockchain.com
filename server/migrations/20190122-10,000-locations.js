const users = require('../model/mongoose/users');
const cities = require('../model/cities');
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

    totalDocsToProcess =await users.count({});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type : 'candidate'}, async function(candidateDoc) {

    });

}

module.exports.down = async function() {


}