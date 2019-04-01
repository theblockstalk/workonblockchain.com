const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');
const crypto = require('../controller/services/crypto');
const messages = require('../model/mongoose/messages');
let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    //////// user migration
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate'}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        logger.debug('user document: ' , userDoc);
        let set = {
            'candidate.employee.employment_type' : 'Full time',
            'candidate.employee.expected_annual_salary' : userDoc.candidate.expected_salary,
            'candidate.employee.currency' : userDoc.candidate.expected_salary_currency,
            'candidate.employee.location' : userDoc.candidate.location,
            'candidate.employee.roles' : userDoc.candidate.roles,
            'candidate.employee.employment_availability' : userDoc.candidate.availability_day

        }
        let unset = {
            'userDoc.candidate.expected_salary': 1,
            'userDoc.candidate.expected_salary_currency':1,
            'userDoc.candidate.location':1,
            'userDoc.candidate.roles':1,
            'userDoc.candidate.availability_day':1
        };

        logger.debug('set object: ', set);
        logger.debug('unset object: ', unset);
        await users.update({_id : userDoc._id}, {$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);

    ////// chat migration
    totalDocsToProcess=0;totalProcessed=0;totalModified=0;
    totalDocsToProcess = await messages.count({
        $or: [
            {"message.job_offer": {$exists: true}},
            {"message.job_offer_accepted": {$exists: true}},
            {"message.job_offer_rejected": {$exists: true}}
        ]
    });
    logger.debug(totalDocsToProcess);
    await messages.findAndIterate({
        $or: [
            {"message.job_offer": {$exists: true}},
            {"message.job_offer_accepted": {$exists: true}},
            {"message.job_offer_rejected": {$exists: true}}
        ]
    }, async function(messageDoc) {
        totalProcessed++;
        logger.debug('message doc id: ' + messageDoc._id);
        logger.debug('message doc: ' , messageDoc);

        let set = {
            'message.approach.employee.job_title' : messageDoc.message.job_offer.title,
            'message.approach.employee.annual_salary' : messageDoc.message.job_offer.salary,
            'message.approach.employee.currency' : messageDoc.message.job_offer.salary_currency,
            'message.approach.employee.employment_type' : messageDoc.message.job_offer.type,
            'message.approach.employee.location' : messageDoc.message.job_offer.location,
            'message.approach.employee.employment_description' : messageDoc.message.job_offer.description

        }
        let unset = {
            'messageDoc.message.job_offer.title': 1,
            'messageDoc.message.job_offer.salary':1,
            'messageDoc.message.job_offer.salary_currency':1,
            'messageDoc.message.job_offer.type':1,
            'messageDoc.message.job_offer.location':1,
            'messageDoc.message.job_offer.description':1
        };

        logger.debug('set object: ', set);
        logger.debug('unset object: ', unset);
        await messages.update({_id : messageDoc._id}, {$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);
}

module.exports.down = async function() {

}