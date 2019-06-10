const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalProcessed = 0;

module.exports.up = async function() {
    totalDocsToProcess =await users.count({type : 'candidate'});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({
        type : 'candidate',
        'candidate.employee': {$exists: true},
        'candidate.current_currency': {$exists: false} ,
        'candidate.current_salary': {$exists: true}}, async function(userDoc) {
        logger.debug("User doc : " , userDoc.candidate);
        totalProcessed++;
        await users.update({ _id: userDoc._id },{ $set: {'candidate.current_currency' : userDoc.candidate.employee.currency} });

    });

    console.log('Total documents: ' + totalDocsToProcess);
    console.log('Total processed users: ' + totalProcessed);
}

module.exports.down = async function() {

}
