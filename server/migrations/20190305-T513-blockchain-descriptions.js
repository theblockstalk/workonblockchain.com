const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const mongoose = require('mongoose');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({type:'candidate'});
    logger.debug(totalDocsToProcess);

    const candCursor = await users.findWithCursor({type:'candidate'});
    let candDoc = await candCursor.next();

    for ( null ; candDoc !== null; candDoc = await candCursor.next()) {
        let platforms = candDoc.candidate.blockchain.commercial_platforms;
        for(let j=0;j<candDoc.candidate.blockchain.smart_contract_platforms.length;j++){
            if(platforms.find(tech => tech.name === candDoc.candidate.blockchain.smart_contract_platforms[j].name)){
                let same = candDoc.candidate.blockchain.smart_contract_platforms[j];
                //console.log(same);
                //console.log(platforms);
                for(let i=0;i<platforms.length;i++){
                    if(platforms[i].name === same.name && platforms[i].exp_year === same.exp_year){
                        console.log('same expr');
                    }
                    else if(platforms[i].exp_year === '2-4'){
                        console.log('2-4');
                    }
                    else{

                    }
                }
                console.log(candDoc.candidate.blockchain.smart_contract_platforms[j]);
            }
            else{
                //platforms.push(candDoc.candidate.blockchain.smart_contract_platforms[j]);
                //console.log(candDoc.candidate.blockchain.smart_contract_platforms[j]);
            }
        }
        //console.log(platforms);
        process.exit();
        //console.log(candDoc.candidate.blockchain.commercial_platforms[0]);
        //console.log(candDoc.candidate.blockchain.smart_contract_platforms[0]);
    }
}

// This function will undo the migration
module.exports.down = async function() {
    console.log('undoing migration');
}