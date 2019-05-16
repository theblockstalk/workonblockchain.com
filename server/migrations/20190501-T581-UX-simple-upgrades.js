const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/company');
const messages = require('../model/mongoose/messages');
const objects = require('../controller/services/objects');

let totalDocsToProcess, totalModified = 0, totalProcessed=0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await messages.count({"message.approach": {$exists: true}});
    logger.debug(totalDocsToProcess);
    await messages.findAndIterate({"message.approach": {$exists: true}}, async function(messageDoc) {
        totalProcessed++;
        logger.debug('message doc id: ' + messageDoc._id);
        logger.debug('message doc: ' , messageDoc);
        let set={};
        if(messageDoc.message.approach.employee) {
            set['message.approach.employee.annual_salary'] = {min: parseInt(messageDoc.message.approach.employee.annual_salary)};
        }
        if(messageDoc.message.approach.contractor) {
            set['message.approach.contractor.hourly_rate'] = {min: parseInt(messageDoc.message.approach.contractor.hourly_rate)};
        }
        logger.debug('set object: ', set);
        await messages.update({_id : messageDoc._id}, {$set : set});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);

    /////////change nationality type from string to array
    totalDocsToProcess=0, totalProcessed=0, totalModified=0 ;
    totalDocsToProcess = await users.count({"nationality": {$exists: true}});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({"nationality": {$exists: true}}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        logger.debug('user doc: ' , userDoc);

        await users.update({_id : userDoc._id}, {$set : {nationality : [userDoc.nationality]}});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    totalDocsToProcess = await messages.count({"message.approach": {$exists: true}});
    logger.debug(totalDocsToProcess);
    await messages.findAndIterate({"message.approach": {$exists: true}}, async function(messageDoc) {
        totalProcessed++;
        logger.debug('message doc id: ' + messageDoc._id);
        logger.debug('message doc: ' , messageDoc);
        let set={};
        if(messageDoc.message.approach.employee) {
            set['message.approach.employee.annual_salary'] = messageDoc.approach.message.employee.annual_salary.min;
        }
        if(messageDoc.message.approach.contractor) {
            set['message.approach.employee.hourly_rate'] = messageDoc.approach.contractor.hourly_rate.min;
        }
        logger.debug('set object: ', set);
        await messages.update({_id : messageDoc._id}, {$set : set});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);

    /////////change nationality type from array to string
    totalDocsToProcess=0, totalProcessed=0, totalModified=0 ;
    totalDocsToProcess = await users.count({"nationality": {$exists: true}});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({"nationality": {$exists: true}}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        logger.debug('user doc: ' , userDoc);

        await users.update({_id : userDoc._id}, {$set : {nationality : userDoc.nationality[0]}});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);
}