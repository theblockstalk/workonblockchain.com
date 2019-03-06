const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const mongoose = require('mongoose');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;
function isEmptyObject(obj) {
    for(let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}

// This function will perform the migration
module.exports.up = async function() {
    let unset = {};
    let set = {};
    totalDocsToProcess = await users.count({type:'candidate'});
    logger.debug(totalDocsToProcess);

    const candCursor = await users.findWithCursor({type:'candidate'});
    let candDoc = await candCursor.next();

    for ( null ; candDoc !== null; candDoc = await candCursor.next()) {
        let platforms = candDoc.candidate.blockchain.commercial_platforms;
        for(let j=0;j<candDoc.candidate.blockchain.smart_contract_platforms.length;j++){
            if(platforms.find(tech => tech.name === candDoc.candidate.blockchain.smart_contract_platforms[j].name)){
                let same = candDoc.candidate.blockchain.smart_contract_platforms[j];
                for(let i=0;i<platforms.length;i++){
                    if(platforms[i].name === same.name && platforms[i].exp_year === same.exp_year){
                        console.log('same exp_year');
                    }
                    else if(platforms[i].name === same.name){
                        let same_years = same.exp_year.split('-');
                        console.log(same_years);
                        let years = platforms[i].exp_year.split('-');
                        console.log(years);
                        if(same_years[0] > years[0]){
                            platforms[i].exp_year = same.exp_year;
                            console.log(same);
                            console.log('same_years is big');
                        }
                        else{
                            console.log(platforms[i]);
                            console.log('platforms years is big');
                        }
                    }
                    else{
                        console.log('nothing');
                    }
                }
            }
            else{
                //these will be pushed in platforms
                platforms.push(candDoc.candidate.blockchain.smart_contract_platforms[j]);
                console.log('diff');
                set['candidate.blockchain.commercial_platforms'] = platforms;
                console.log(set);
            }
        }

        unset['candidate.blockchain.smart_contract_platforms'] =1;
        set['candidate.blockchain.description_commercial_platforms'] = '';

        let updateObj;
        if (!isEmptyObject(set) && !isEmptyObject(unset)) {
            updateObj = {$set: set, $unset: unset}
        } else if (!isEmptyObject(set)) {
            updateObj = {$set: set};
        } else if (!isEmptyObject(unset)) {
            updateObj = {$unset: unset};
        }

        if (updateObj) {
            logger.debug("migrate user doc: ", set);
            await users.update({ _id: candDoc._id }, updateObj);
            totalModified++;
        }
    }
}

// This function will undo the migration
module.exports.down = async function() {
    console.log('undoing migration');
}