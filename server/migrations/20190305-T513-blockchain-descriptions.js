const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const object = require('../controller/services/objects');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

function compareYears(expYr1, expYr2) {
    let same_years = expYr1.split('-');
    let years = expYr2.split('-');
    return same_years[0] > years[0];
}

function aggregateArray (array, platformArray, propertyName) {
    for (let platform of platformArray) {
        let index = array.findIndex( (arrayVal) => arrayVal[propertyName] === platform[propertyName]);
        if (index !== -1) {
            if (compareYears(platform.exp_year, array[index].exp_year)) {
                array[index].exp_year = platform.exp_year
            }
        } else {
            if(propertyName === 'name') {
                array.push({
                    name: platform[propertyName],
                    exp_year: platform.exp_year
                });
            }
            else{
                array.push({
                    skill: platform[propertyName],
                    exp_year: platform.exp_year
                });
            }
        }
    }
}

// This function will perform the migration
module.exports.up = async function() {
    let unset = {};
    let set = {};
    totalDocsToProcess = await users.count({type:'candidate',"candidate.blockchain": {$exists: true}});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type:'candidate',"candidate.blockchain": {$exists: true}}, async function(candDoc) {
        logger.debug("processing user doc: ", {userId: candDoc._id});

        let technologies = [], skills = [];
        if (candDoc.candidate.blockchain.commercial_platforms) {
            aggregateArray(technologies, candDoc.candidate.blockchain.commercial_platforms, "name");
        }
        if (candDoc.candidate.blockchain.smart_contract_platforms) {
            aggregateArray(technologies, candDoc.candidate.blockchain.smart_contract_platforms, "name");
        }
        if (candDoc.candidate.blockchain.commercial_skills) {
            aggregateArray(skills, candDoc.candidate.blockchain.commercial_skills, "skill");
        }
        if (candDoc.candidate.blockchain.formal_skills) {
            aggregateArray(skills, candDoc.candidate.blockchain.formal_skills, "skill");
        }

        set = {
            "candidate.blockchain.commercial_platforms": technologies,
            "candidate.blockchain.description_commercial_platforms": '',
            "candidate.blockchain.description_experimented_platforms": '',
            "candidate.blockchain.commercial_skills": skills,
            "candidate.blockchain.description_commercial_skills": ''
        };
        unset = {
            "candidate.blockchain.smart_contract_platforms": 1,
            "candidate.blockchain.formal_skills": 1
        };

        let updateObj = {$set: set, $unset: unset};

        if (updateObj) {
            logger.debug("migrate user doc: ", set);
            await users.update({_id: candDoc._id}, updateObj);
            totalModified++;
        }
    });
}

// This function will undo the migration
module.exports.down = async function() {
    let unset = {};
    let set = {};
    totalDocsToProcess = await users.count({type:'candidate',"candidate.blockchain": {$exists: true}});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({type:'candidate',"candidate.blockchain": {$exists: true}}, async function(candDoc) {
        unset = {
            "candidate.blockchain.description_commercial_platforms": 1,
            "candidate.blockchain.description_experimented_platforms": 1,
            "candidate.blockchain.description_commercial_skills": 1
        };
        let updateObj = {$unset: unset};
        if (updateObj) {
            logger.debug("migrate user doc: ", set);
            await users.update({_id: candDoc._id}, updateObj);
            totalModified++;
        }
    });
}