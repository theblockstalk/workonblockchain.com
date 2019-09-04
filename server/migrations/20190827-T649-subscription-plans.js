const users = require('../model/mongoose/users');
const referral = require('../model/mongoose/referral');
const companies = require('../model/mongoose/company');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await referral.count( { discount: { $exists: true} } );
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await referral.findAndIterate({ discount: { $exists: true} }, async function (referralDoc) {
        let set = {};
        totalProcessed++;
        const userDocs = await users.find({type: 'company', referred_email: referralDoc.email});
        if(userDocs && userDocs.length > 0){
            for (let userDoc of userDocs) {
                const employerDoc = await companies.findOne({_creator : userDoc._id});
                if(employerDoc){
                    set['discount'] = referralDoc.discount;
                    await companies.update({_id: employerDoc._id}, {$set: set});
                    logger.debug('employer doc id: ' + employerDoc._id);
                    totalModified++;
                }
            }
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    let unSet = {};
    totalDocsToProcess = await companies.count( { discount: { $exists: true} } );
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await companies.findAndIterate({ discount: { $exists: true} }, async function (companyDoc) {
        totalProcessed++;
        let unset = {
            'discount': 1
        };
        await companies.update({_id : companyDoc._id}, {$unset: unset});
        totalModified++;
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}