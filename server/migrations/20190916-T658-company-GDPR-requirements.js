const users = require('../model/mongoose/users');
const referral = require('../model/mongoose/referrals');
const companies = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');
const enums = require('../model/enumerations');

let totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await users.count( { type: 'company' } );
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await users.findAndIterate({ type: 'company' }, async function (userDoc) {
        let set = {};
        totalProcessed++;
        const employerDoc = await companies.findOne({_creator : userDoc._id, company_country: { $exists: true}});
        if(employerDoc){
            console.log('employerDoc: ' + employerDoc.company_country);
            if (enums.euCountries.indexOf(employerDoc.company_country) > -1) {
                //In the array!
                logger.debug('EU country');
            } else {
                //Not in the array
                set['is_approved'] = 0;
                logger.debug('set object: ', set);
                await users.update({_id: userDoc._id}, {$set: set});
                logger.debug('user doc id: ' + userDoc._id);
                totalModified++;
            }
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    totalDocsToProcess = await users.count( { type: 'company' } );
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await users.findAndIterate({ type: 'company' }, async function (userDoc) {
        totalProcessed++;
        let set = {
            'is_approved': 1
        };
        logger.debug('userDoc doc id: ' + userDoc._id);
        logger.debug('set object: ', set);
        await users.update({_id : userDoc._id}, {$set: set});
        totalModified++;
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}