const users = require('../model/mongoose/users');
const skills = require('../model/mongoose/skills');
const objects = require('../controller/services/objects');
const csv = require('csvtojson');
const skillsFilePath = __dirname + '/files/T667-skills-collection.csv';

let totalDocsToProcess = 0, totalModified = 0, totalProcessed = 0;
let totalCompanyProcessed=0, totalCompanyModified=0, totalCompanyIncompleteDoc = 0;
let newDocs= 0, totalIncompleteDoc = 0;

function mapToArray(array,propertyName) {
    let mappedArray = [];
    if(propertyName){
        for (let i=0; i< array.length; i++){
            if(propertyName) mappedArray.push(array[i][propertyName]);
            else mappedArray.push(array[i]);
        }
        return mappedArray;
    }
}

function convertExpToNum(exp_year) {
    switch (exp_year) {
        case '0-1':
            return 1;
            break;
        case '1-2':
            return 2;
            break;
        case '2-4':
            return 3;
            break;
        case '4-6':
            return 4;
            break;
        default:
            return 6
    }
}

function makeObj(skill, exp_year){
    let mappedObj = [];
    mappedObj.push({
        skills_id: skill._id,
        name: skill.name,
        type: skill.type,
        exp_year: convertExpToNum(exp_year)
    });
    return mappedObj;
}

module.exports.up = async function() {
    /*const now = new Date();
    const skillsJsonArray = await csv().fromFile(skillsFilePath);
    console.log("Total number of skills in csv: " + skillsJsonArray.length);

    for(let skill of skillsJsonArray) {
        let data = {
            name : skill.Name,
            type : skill.Type,
            created_date : now
        };
        console.log(data);
        await skills.insert(data);
        newDocs++;
    }
    console.log("Number of skills added in skills collection: " + newDocs);*/

    totalDocsToProcess = await users.count({type : 'candidate'});

    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        let newCommercialSkills = [], newSkills = [], experimentedPlatforms = [];

        if (userDoc.candidate.blockchain) {
            const blockchain = userDoc.candidate.blockchain;
            if (blockchain.commercial_platforms && blockchain.commercial_platforms.length > 0) {
                for (let block_skill_commercial of blockchain.commercial_platforms) {
                    const skill = await skills.findOne({name: block_skill_commercial.name});
                    if(skill) {
                        newCommercialSkills.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type,
                            exp_year: convertExpToNum(block_skill_commercial.exp_year)
                        });
                    }
                }
            }
            if (blockchain.commercial_skills && blockchain.commercial_skills.length > 0) {
                for (let commercial_skills of blockchain.commercial_skills) {
                    const skill = await skills.findOne({name: commercial_skills.skill});
                    if(skill) {
                        newSkills.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type,
                            exp_year: convertExpToNum(commercial_skills.exp_year)
                        });
                    }
                }
            }
            if (blockchain.experimented_platforms && blockchain.experimented_platforms.length > 0) {
                for (let experimented_platforms of blockchain.experimented_platforms) {
                    const skill = await skills.findOne({name: experimented_platforms});
                    if(skill) {
                        experimentedPlatforms.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type
                        });
                    }
                }
            }
            // same for blockchain.commercial_skills
            // same for blockchain.experimented_platforms but use newSkills and no exp_year
            // same for userDoc.programming_languages
        }
        /*if(userDoc.candidate.programming_languages) {
            console.log(userDoc.candidate.programming_languages);
        }*/

        let setCandidate = {};
        if (newCommercialSkills.length > 0) {
            setCandidate.commercial_platforms = newCommercialSkills;
            if(userDoc.candidate.blockchain.description_commercial_platforms)
                setCandidate.description_commercial_platforms = userDoc.candidate.blockchain.description_commercial_platforms;
        }
        if (newSkills.length > 0) {
            console.log(newSkills);process.exit();
            setCandidate.commercial_skills = newSkills;
            if(userDoc.candidate.blockchain.description_commercial_skills)
                setCandidate.description_commercial_skills = userDoc.candidate.blockchain.description_commercial_skills;
        }
        if (experimentedPlatforms.length > 0) {
            setCandidate.experimented_platforms = experimentedPlatforms;
            if(userDoc.candidate.blockchain.description_experimented_platforms)
                setCandidate.description_experimented_platforms = userDoc.candidate.blockchain.description_experimented_platforms;
        }
        if (!objects.isEmpty(setCandidate)) {
            console.log({_id: userDoc._id}, {$set: {'candidate.blockchain': setCandidate}});
            await users.update({_id: userDoc._id}, {$set: {'candidate.blockchain': setCandidate}});
            totalModified++;
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
};

module.exports.down = async function() {
    //will undo migration
};
