const users = require('../model/mongoose/users');
const referral = require('../model/mongoose/referrals');
const companies = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');
const enums = require('../model/enumerations');

let totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count({});
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await users.findAndIterate({}, async function (userDoc) {

    })

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
}