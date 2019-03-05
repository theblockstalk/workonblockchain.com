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
        console.log(candDoc.candidate.blockchain.commercial_platforms);
        console.log(candDoc.candidate.blockchain.smart_contract_platforms);
        process.exit();
    }
}

// This function will undo the migration
module.exports.down = async function() {
    console.log('undoing migration');
}