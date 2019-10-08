const users = require('../model/mongoose/users');
const skills = require('../model/mongoose/skills');
const objects = require('../controller/services/objects');
const companies = require('../model/mongoose/companies');
const csv = require('csvtojson');
const skillsFilePath = __dirname + '/files/T667-skills-collection.csv';

let totalDocsToProcess = 0, totalModified = 0, totalProcessed = 0;

function mapToArray(array,propertyName) {
    let mappedArray = [];
    for (let i=0; i< array.length; i++){
        if(propertyName) mappedArray.push(array[i][propertyName]);
        else mappedArray.push(array[i]);
    }
    return mappedArray;
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
            return 4;
            break;
        case '4-6':
            return 6;
            break;
        default:
            return 6
    }
}

module.exports.up = async function() {
    const now = new Date();
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
    console.log("Number of skills added in skills collection: " + newDocs);

    //for candidate
    totalDocsToProcess = await users.count({type : 'candidate'});
    await users.findAndIterate({type : 'candidate'}, async function(userDoc) {
        totalProcessed++;
        console.log("Migrating candidate user_id: " + userDoc._id);
        let newCommercialSkills = [], newSkills = [], set = {};
        let unset = {
            'candidate.blockchain': 1,
            'candidate.programming_languages': 1
        };

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
                    else
                        console.error("Skill with name " + block_skill_commercial.name + " was not found");
                }
            }
            if (blockchain.commercial_skills && blockchain.commercial_skills.length > 0) {
                for (let commercial_skills of blockchain.commercial_skills) {
                    const skill = await skills.findOne({name: commercial_skills.skill});
                    if(skill) {
                        newCommercialSkills.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type,
                            exp_year: convertExpToNum(commercial_skills.exp_year)
                        });
                    }
                    else
                        console.error("Skill with name " + commercial_skills.skill + " was not found");
                }
            }
            if (blockchain.experimented_platforms && blockchain.experimented_platforms.length > 0) {
                for (let experimented_platforms of blockchain.experimented_platforms) {
                    const skill = await skills.findOne({name: experimented_platforms});
                    if(skill) {
                        newSkills.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type
                        });
                    }
                    else
                        console.error("Skill with name " + experimented_platforms + " was not found");
                }
            }

            if(userDoc.candidate.blockchain.description_commercial_platforms)
                set['candidate.description_commercial_skills'] = userDoc.candidate.blockchain.description_commercial_platforms;
            if(userDoc.candidate.blockchain.description_commercial_skills) {
                if (set['candidate.description_commercial_skills'])
                    set['candidate.description_commercial_skills'] = set['candidate.description_commercial_skills'] + ' \n ' + userDoc.candidate.blockchain.description_commercial_skills;
                else
                    set['candidate.description_commercial_skills'] = userDoc.candidate.blockchain.description_commercial_skills;
            }

            if(userDoc.candidate.blockchain.description_experimented_platforms)
                set['candidate.description_skills'] = userDoc.candidate.blockchain.description_experimented_platforms;
        }
        if(userDoc.candidate.programming_languages) {
            for (let programming_language of userDoc.candidate.programming_languages) {
                const skill = await skills.findOne({name: programming_language.language});
                if(skill) {
                    newCommercialSkills.push({
                        skills_id: skill._id,
                        name: skill.name,
                        type: skill.type,
                        exp_year: convertExpToNum(programming_language.exp_year)
                    });
                }
                else
                    console.error("Skill with name " + programming_language.language + " was not found");
            }
        }

        if (newCommercialSkills.length > 0)
            set['candidate.commercial_skills'] = newCommercialSkills;

        if (newSkills.length > 0)
            set['candidate.skills'] = newSkills;

        if (!objects.isEmpty(set)) {
            let updateObj = {$set: set, $unset: unset};
            console.log({_id: userDoc._id}, {$set: {'set': set}});
            await users.update({_id : userDoc._id}, updateObj);
            totalModified++;
        }
    });

    //for company
    totalDocsToProcess = 0, totalModified = 0, totalProcessed = 0;

    totalDocsToProcess = await users.count({type : 'company'});
    await users.findAndIterate({type : 'company'}, async function(userDoc) {
        console.log("Migrating company user_id: " + userDoc._id);

        let employerDoc = await companies.findOne({_creator : userDoc._id, saved_searches: { $exists: true}});
        if(employerDoc){
            let savedSearchBlockchain = [];
            let pushObj = {};
            let savedSearches = employerDoc.saved_searches;
            for (let savedSearch of savedSearches) {
                for(let blockchain of savedSearch.blockchain){
                    const skill = await skills.findOne({name: blockchain});
                    if(skill) {
                        savedSearchBlockchain.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type
                        });
                    }
                }
                for(let skillDB of savedSearch.skills){
                    const skill = await skills.findOne({name: skillDB});
                    if(skill) {
                        savedSearchBlockchain.push({
                            skills_id: skill._id,
                            name: skill.name,
                            type: skill.type
                        });
                    }
                }
                savedSearch.blockchain = [];
                savedSearch['skills'] = savedSearchBlockchain;
            }

            console.log({_id: employerDoc._id}, {$set: {'employerDoc.saved_searches': employerDoc.saved_searches}});
            let set = {};
            set['saved_searches'] = employerDoc.saved_searches;
            await companies.update({_id: employerDoc._id}, {$set: set});
            totalModified++;
        }
    });

    console.log('Total companies document to process: ' + totalDocsToProcess);
    console.log('Total companies processed document: ' + totalProcessed);
    console.log('Total companies modified document: ' + totalModified);
};

module.exports.down = async function() {
    //will undo migration
};
