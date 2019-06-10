const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');

function checkIfArrayIsUnique(myArray,propertyName) {
    for (var i = 0; i < myArray.length; i++) {
        for (var j = 0; j < myArray.length; j++) {
            if (i !== j) {
                if(propertyName){
                    if (myArray[i][propertyName] === myArray[j][propertyName]){
                        return true; // means there are duplicate values
                    }
                }
                else {
                    if (myArray[i] === myArray[j]) {
                        return true; // means there are duplicate values
                    }
                }
            }
        }
    }
    return false; // means there are no duplicate values.
}

function filter_array(arr) {
    var hashTable = {};
    return arr.filter(function (el) {
        var key = JSON.stringify(el);
        var match = Boolean(hashTable[key]);
        return (match ? false : hashTable[key] = true);
    });
}

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type:'candidate',"candidate.blockchain": {$exists: true}});
    logger.debug(totalDocsToProcess);
    let ids = [];

    await users.findAndIterate({type:'candidate',"candidate.blockchain": {$exists: true}}, async function(candDoc) {
        //logger.debug("processing user doc: ", {userId: candDoc._id});
        if(candDoc.candidate.blockchain.experimented_platforms && candDoc.candidate.blockchain.experimented_platforms.length > 0) {
            const experimented_platforms = candDoc.candidate.blockchain.experimented_platforms;
            let return_experimented_platforms = checkIfArrayIsUnique(experimented_platforms);
            if (return_experimented_platforms) ids.push(candDoc._id);
        }

        if(candDoc.candidate.blockchain.commercial_platforms && candDoc.candidate.blockchain.commercial_platforms.length>0) {
            const commercial_platforms = candDoc.candidate.blockchain.commercial_platforms;
            let return_commercial_platforms = checkIfArrayIsUnique(commercial_platforms, 'name');
            if (return_commercial_platforms) ids.push(candDoc._id);
        }

        if(candDoc.candidate.blockchain.commercial_skills && candDoc.candidate.blockchain.commercial_skills.length>0)
        {
            const commercial_skills = candDoc.candidate.blockchain.commercial_skills;
            let return_commercial_skills = checkIfArrayIsUnique(commercial_skills, 'skill');
            if (return_commercial_skills) ids.push(candDoc._id);
        }

        if(candDoc.candidate.blockchain.formal_skills && candDoc.candidate.blockchain.formal_skills.length>0) {
            const formal_skills = candDoc.candidate.blockchain.formal_skills;
            let return_formal_skills = checkIfArrayIsUnique(formal_skills, 'skill');
            if (return_formal_skills) ids.push(candDoc._id);
        }

        if(candDoc.candidate.blockchain.smart_contract_platforms && candDoc.candidate.blockchain.smart_contract_platforms.length>0) {
            const smart_contract_platforms = candDoc.candidate.blockchain.smart_contract_platforms;
            let return_smart_contract_platforms = checkIfArrayIsUnique(smart_contract_platforms, 'name');
            if (return_smart_contract_platforms) ids.push(candDoc._id);
        }
    });

    ids = filter_array(ids);
    console.log(ids);
}

module.exports.down = async function() {
    //nothing for it
}
