const users = require('../model/mongoose/users');
const companies = require('../model/mongoose/companies');
const logger = require('../controller/services/logger');
const csv = require('csvtojson');
const candidateEmailsPath = __dirname + '/files/T496-candidates-sent.csv';
let totalDocsToProcess, totalProcessed = 0;

module.exports.up = async function() {
    const candidateEmails = await csv().fromFile(candidateEmailsPath);

    totalDocsToProcess = candidateEmails.length;
    logger.debug(totalDocsToProcess);
    for (let candidate of candidateEmails) {
        logger.debug('adding log: ', { newLog: candidate });
        const userDoc = await users.findOneByEmail(candidate.email);
        if(userDoc) {
            await companies.update({_creator: userDoc._id}, {$push: {
                'candidates_sent_by_email': {
                    user: candidate.candidate,
                    sent: candidate.date
                }
            }});
            totalProcessed++;
        }

    }

    console.log('Total logs: ' + totalDocsToProcess);
    console.log('Total processed logs: ' + totalProcessed);
}

module.exports.down = async function() {
    totalDocsToProcess =await companies.count({candidates_sent_by_email: { $exists: true } });
    logger.debug(totalDocsToProcess);
    await companies.update({candidates_sent_by_email: { $exists: true } }, {$unset: {candidates_sent_by_email: 1}});

    console.log('Total company document to process: ' + totalDocsToProcess);
    console.log('Total processed document: ' + totalDocsToProcess);

}