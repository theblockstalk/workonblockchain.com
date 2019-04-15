const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');
const crypto = require('../controller/services/crypto');
const objects = require('../controller/services/objects');

const messages = require('../model/mongoose/messages');
let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    //////// user
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate'}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        let set = { }
        let unset={};
        if(userDoc.candidate.expected_salary) {
            set['candidate.employee.expected_annual_salary'] =  userDoc.candidate.expected_salary;
            unset['candidate.expected_salary'] = 1;
        }
        if(userDoc.candidate.expected_salary_currency) {
            set['candidate.employee.currency'] = userDoc.candidate.expected_salary_currency;
            unset['candidate.expected_salary_currency'] = 1;
        }
        if(userDoc.candidate.locations) {
            set['candidate.employee.location'] = userDoc.candidate.locations;
            unset['candidate.location'] = 1;
        }
        if( userDoc.candidate.roles) {
            set['candidate.employee.roles'] = userDoc.candidate.roles;
            unset['candidate.roles'] = 1;
        }
        if(userDoc.candidate.availability_day) {
            set['candidate.employee.employment_availability'] = userDoc.candidate.availability_day;
            unset['candidate.availability_day'] = 1;
        }

        if(!objects.isEmpty(set)) set['candidate.employee.employment_type'] = 'Full time'

        let updateObj;
        if(!objects.isEmpty(set) || !objects.isEmpty(unset)) {
            updateObj = {
                $set: set,
                $unset: unset
            }
        }

        logger.debug('update object: ', updateObj);
        if(!objects.isEmpty(updateObj)) {
            await users.update({_id : userDoc._id}, updateObj );
            totalModified++;
        }
    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);

    ////// chat
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
        let set, unset;
        if(messageDoc.message.job_offer) {
            set = {
                'message.approach.employee.job_title' : messageDoc.message.job_offer.title,
                'message.approach.employee.annual_salary' : messageDoc.message.job_offer.salary,
                'message.approach.employee.currency' : messageDoc.message.job_offer.salary_currency,
                'message.approach.employee.employment_type' : messageDoc.message.job_offer.type,
                'message.approach.employee.location' : messageDoc.message.job_offer.location,
                'message.approach.employee.employment_description' : messageDoc.message.job_offer.description,
                "msg_tag": 'approach'
            }
            unset = {
                'message.job_offer': 1,
            };
        }
        if(messageDoc.message.job_offer_accepted) {
            set = {
                'message.approach_accepted.message' : messageDoc.message.job_offer_accepted.message,
                'msg_tag': 'approach_accepted'
            }
            unset = {
                'message.job_offer_accepted': 1,
            };
        }
        if(messageDoc.message.job_offer_rejected) {
            set = {
                'message.approach_rejected.message' : messageDoc.message.job_offer_rejected.message,
                'msg_tag': 'approach_rejected'
            }
            unset = {
                'message.job_offer_rejected': 1,
            };
        }


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
    //////// user
    totalDocsToProcess = await users.count({type: 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({type: 'candidate', 'candidate.employee' : {$exists: true}}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        logger.debug('user document: ' , userDoc);

        let set = {
            'candidate.expected_salary' : userDoc.candidate.employee.expected_annual_salary,
            'candidate.expected_salary_currency' : userDoc.candidate.employee.currency,
            'candidate.locations' : userDoc.candidate.employee.location,
            'candidate.roles': userDoc.candidate.employee.roles,
            'candidate.availability_day': userDoc.candidate.employee.employment_availability

        }
        let unset = {
            'candidate.employee': 1
        };

        logger.debug('set object: ', set);
        logger.debug('unset object: ', unset);
        await users.update({_id : userDoc._id}, {$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);

    ////// chat
    totalDocsToProcess=0;totalProcessed=0;totalModified=0;
    totalDocsToProcess = await messages.count({
        $or: [
            {"message.approach": {$exists: true}},
            {"message.approach_accepted": {$exists: true}},
            {"message.approach_rejected": {$exists: true}}
        ]
    });
    logger.debug(totalDocsToProcess);
    await messages.findAndIterate({
        $or: [
            {"message.approach": {$exists: true}},
            {"message.approach_accepted": {$exists: true}},
            {"message.approach_rejected": {$exists: true}}
        ]
    }, async function(messageDoc) {
        totalProcessed++;
        logger.debug('message doc id: ' + messageDoc._id);
        logger.debug('message doc: ' , messageDoc);
        let set,unset;
        if(messageDoc.message.approach) {
             set = {
                'message.job_offer.title': messageDoc.message.approach.employee.job_title,
                'message.job_offer.salary': messageDoc.message.approach.employee.annual_salary ,
                'message.job_offer.salary_currency': messageDoc.message.approach.employee.currency,
                'message.job_offer.type': messageDoc.message.approach.employee.employment_type,
                'message.job_offer.location': messageDoc.message.approach.employee.location ,
                'message.job_offer.description': messageDoc.message.approach.employee.employment_description,
                 'msg_tag': 'job_offer'

            }
             unset = {
                'message.approach': 1
            };
        }

        if(messageDoc.message.approach_accepted) {
            set = {
                'message.job_offer_accepted.message' : messageDoc.message.approach_accepted.message,
                'msg_tag': 'job_offer_accepted'
            }
            unset = {
                'message.approach_accepted': 1
            };
        }
        if(messageDoc.message.approach_rejected) {
            set = {
                'message.job_offer_rejected.message' : messageDoc.message.approach_rejected.message,
                'msg_tag': 'job_offer_rejected'
            }
            unset = {
                'message.approach_rejected': 1
            };
        }


        logger.debug('set object: ', set);
        logger.debug('unset object: ', unset);
        await messages.update({_id : messageDoc._id}, {$set : set, $unset: unset});
        totalModified++;

    });

    console.log('Total message document to process: ' + totalDocsToProcess);
    console.log('Total message processed document: ' + totalProcessed);
    console.log('Total message modified document: ' + totalModified);
}