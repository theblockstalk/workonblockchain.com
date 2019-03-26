const users = require('../model/mongoose/users');
const logger = require('../controller/services/logger');
const crypto = require('../controller/services/crypto');

let totalDocsToProcess=0, totalModified = 0, totalProcessed = 0;

module.exports.up = async function() {

    totalDocsToProcess = await users.count({});
    logger.debug(totalDocsToProcess);

    await users.findAndIterate({}, async function(userDoc) {
        totalProcessed++;
        logger.debug('user doc id: ' + userDoc._id);
        let unset = {
            jwt_token: 1
        };

        if (userDoc.type === 'candidate') {
            let hashedPasswordAndSalt = crypto.createPasswordHash('', userDoc.salt);

            if (hashedPasswordAndSalt === userDoc.password_hash) {
                unset.password_hash = 1;
                unset.salt = 1;
            }

            unset.social_type = 1
        }

        logger.debug('unset object: ', unset);
        await users.update({_id : userDoc._id}, {$unset: unset});
        totalModified++;

    });

    console.log('Total user document to process: ' + totalDocsToProcess);
    console.log('Total user processed document: ' + totalProcessed);
    console.log('Total user modified document: ' + totalModified);
}

module.exports.down = async function() {

}