const Users = require('../model/users');
const Candidate = require('../model/candidate_profile');
const logger = require('../controller/services/logger');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await Users.find({type : 'candidate'}).count();
    logger.debug(totalDocsToProcess);

    const userCursor = await Users.find({type : 'candidate'}).cursor();
    let userDoc = await userCursor.next();

    for ( null ; userDoc !== null; userDoc = await userCursor.next()) {
        totalProcessed++;
        logger.debug("Migrating user: ", userDoc._id);

        const now = new Date();
        let set, statuses;
        let newStatus = {
            timestamp: now
        };
        const createdStatus = {
            status: "created",
            timestamp: userDoc.created_date
        };
        if (userDoc.is_approved) {
            newStatus.status = "approved";
            set = { 'first_approved_date': now };
            const completedStatus = {
                status: "wizard completed",
                timestamp: userDoc.created_date
            };
            statuses = [newStatus, completedStatus, createdStatus];
        } else {
            const candidateDoc = Candidate.findOne({_creator: userDoc._id}).lean();
            if (isWizardComplete(userDoc, candidateDoc)) {
                newStatus.status = "wizard completed";
                statuses = [newStatus, createdStatus];
            } else {
                newStatus.status = "created";
                statuses = [createdStatus];
            }
        }

        let updateObj = {
            $unset: { is_approved: 1, created_date: 1}
        };
        if (set) {
            updateObj["$set"] = set;
        }

        logger.debug("update: ", updateObj);
        const update = await Users.update({_id: userDoc._id}, updateObj);
        if (update && update.nModified) totalModified++;

        logger.debug("statuses: ", statuses);
        await User.update({_id: userDoc._id}, {
                $push: {
                    'candidate.status': {
                        $each: statuses
                    }
                }
            }
        );
    }
    logger.debug('Total users docs to process: ', totalDocsToProcess);
    logger.debug('Total processed: ', totalProcessed);
    logger.debug('Total modified: ', totalModified);

}

function isWizardComplete(userDoc, candidateDoc) {
    if (!userDoc.candidate.base_city || !userDoc.candidate.base_country) return false;
    if (!candidateDoc.terms_id || !candidateDoc.first_name || !candidateDoc.last_name ||
        !candidateDoc.contact_number || !candidateDoc.why_work || !candidateDoc.availability_day ||
        !candidateDoc.nationality || !candidateDoc.current_currency || !candidateDoc.current_salary ||
        !candidateDoc.expected_salary || !candidateDoc.expected_salary_currency || !candidateDoc.description) {
        return false;
    }
    if (!candidateDoc.location && candidateDoc.location.length === 0) return false;
    if (!candidateDoc.roles && candidateDoc.roles.length === 0) return false;

    return true;
}

// This function will undo the migration
module.exports.down = async function() {

}