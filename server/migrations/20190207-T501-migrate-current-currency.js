const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');

let totalDocsToProcess=0, totalProcessed = 0;

module.exports.up = async function() {
    totalDocsToProcess =await users.count({
        type : 'candidate',
        'candidate.current_currency': {$exists: false} ,
        'candidate.current_salary': {$exists: true}});
    logger.debug(totalDocsToProcess);
    await users.findAndIterate({
        type : 'candidate',
        'candidate.current_currency': {$exists: false} ,
        'candidate.current_salary': {$exists: true}}, async function(userDoc) {

        logger.debug("User doc : " , userDoc.candidate);
        if(userDoc.candidate.current_salary && !userDoc.candidate.current_currency) {
            totalProcessed++;
            await users.update({ _id: userDoc._id },{ $set: {'candidate.current_currency' : userDoc.candidate.expected_salary_currency} });
        }

    });

    console.log('Total documents: ' + totalDocsToProcess);
    console.log('Total processed users: ' + totalProcessed);
}

module.exports.down = async function() {

}
