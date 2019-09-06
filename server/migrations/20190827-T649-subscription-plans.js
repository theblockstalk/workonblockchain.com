const users = require('../model/mongoose/users');
const referral = require('../model/mongoose/referrals');
const companies = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');

let totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0;

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

    //setting all companies to free plan
    totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0;
    totalDocsToProcess = 0;
    totalDocsToProcess = await users.count({type: 'company', is_verify: 1});
    console.log('totalDocsToProcess: ' + totalDocsToProcess);
    await users.findAndIterate({type: 'company', is_verify: 1}, async function (userDoc) {
        totalProcessed++;
        let set = {};
        let pushObj = {};
        let freePlan = 'Free till you hire';
        const companyDoc = await companies.findOneAndPopulate(userDoc._id);
        set.pricing_plan = freePlan;
        let history = {
            pricing_plan: freePlan,
            timestamp : userDoc.created_date,
            updated_by: userDoc._id
        };
        pushObj = {
            $push: {
                'history': {
                    $each: [history],
                    $position: 0
                }
            }
        };

        logger.debug('companyDoc doc id: ' + companyDoc._id);
        pushObj.$set = set;
        await companies.update({ _id: companyDoc._id },pushObj);
        totalModified++;
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
        logger.debug('employer doc id: ' + companyDoc._id);
        await companies.update({_id : companyDoc._id}, {$unset: unset});
        totalModified++;
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);

    //unsetting price plan & history
    totalDocsToProcess = 0 , totalModified = 0, totalProcessed=0;
    totalDocsToProcess = await companies.count( { history: { $exists: true }, pricing_plan: { $exists: true } } );
    console.log('totalDocsToProcess: ' + totalDocsToProcess);

    await companies.findAndIterate( { history: { $exists: true }, pricing_plan: { $exists: true } } , async function (companyDoc) {
        totalProcessed++;
        let unset = {
            'history': 1,
            'pricing_plan': 1
        };
        logger.debug('employer doc id: ' + companyDoc._id);
        await companies.update({_id : companyDoc._id}, {$unset: unset});
        totalModified++;
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}