const users = require('../model/mongoose/users');
const skills = require('../model/mongoose/skills');
const logger = require('../controller/services/logger');
const csv = require('csvtojson');
const skillsFilePath = __dirname + '/files/T667-skills-collection.csv';

let totalDocsToProcess = 0, totalModified = 0, totalProcessed = 0;
let totalCompanyProcessed=0, totalCompanyModified=0, totalCompanyIncompleteDoc = 0;
let newDocs= 0, totalIncompleteDoc = 0;

function mapToArray(array,propertyName) {
    let mappedArray = [];
    if(propertyName){
        for (let i=0; i< array.length; i++){
            mappedArray.push(array[i][propertyName]);
        }
        return mappedArray;
    }
    else{
        for (let i=0; i< array.length; i++){
            mappedArray.push(array[i]);
        }
        return mappedArray;
    }
}

module.exports.up = async function() {
    /*const skillsJsonArray = await csv().fromFile(skillsFilePath);
    console.log("Total number of skills in csv: " + skillsJsonArray.length);

    for(let skill of skillsJsonArray) {
        let data = {
            name : skill.Name,
            type : skill.Type,
            created_date : new Date()
        };
        logger.debug("skills document: ", data);
        await skills.insert(data);
        newDocs++;
    }
    console.log("Number of skills added in skills collection: " + newDocs);*/

    totalDocsToProcess = await users.count({type : 'candidate'});

    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        if(userDoc.candidate.blockchain) {
            console.log("candidate Doc id: " + userDoc._id);
            if(userDoc.candidate.blockchain.commercial_platforms){
                let newCommercialPlatforms = mapToArray(userDoc.candidate.blockchain.commercial_platforms, 'name');
                console.log(newCommercialPlatforms);
                // find in skills collection
                await skills.findAndIterate({name :  {$in: newCommercialPlatforms}}, async function(skillsDoc) {
                    console.log('skillsDoc');
                    console.log(skillsDoc);
                    process.exit();
                });
            }
        }
        if(userDoc.candidate.programming_languages) {
            console.log(userDoc.candidate.programming_languages);
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
};

module.exports.down = async function() {
    //will undo migration
};
