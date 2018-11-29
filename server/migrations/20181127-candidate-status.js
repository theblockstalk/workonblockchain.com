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
        logger.debug("(" + totalProcessed + "/" + totalDocsToProcess + ") Migrating user: " + userDoc._id.toString());

        const now = new Date();
        let set, statuses;

        let newStatus = {
            timestamp: now
        };
        const createdStatus = {
            status: "created",
            timestamp: userDoc.created_date
        };

        if (userDoc.is_approved === 1) {
            newStatus.status = "approved";
            set = { 'first_approved_date': now };
            const completedStatus = {
                status: "wizard completed",
                timestamp: userDoc.created_date
            };
            statuses = [newStatus, completedStatus, createdStatus];
        } else if (userDoc.is_approved === 0) {
            const candidateDoc = await Candidate.findOne({_creator: userDoc._id}).lean();

            if (isWizardComplete(userDoc, candidateDoc) === 1) {
                newStatus.status = "wizard completed";
                statuses = [newStatus, createdStatus];
            } else {
                newStatus.status = "created";
                statuses = [createdStatus];
            }
        }

        if (userDoc.created_date) {
            let updateObj = {
                $unset: { is_approved: 1, created_date: 1},
                $push: {
                    'candidate.status': {
                        $each: statuses
                    }
                }
            };
            if (set) {
                updateObj["$set"] = set;
            }

            logger.debug("user doc update", updateObj);
            const update = await Users.update({_id: userDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
        }
    }
    logger.debug('Total users docs to process: ' + totalDocsToProcess);
    logger.debug('Total processed: ' + totalProcessed);
    logger.debug('Total modified: ' + totalModified);
}

function isWizardComplete(userDoc, candidateDoc) {
    console.log(candidateDoc.terms_id);
    if (!candidateDoc.terms_id) return 3;
    if (!candidateDoc.first_name) return 4;
    if (!candidateDoc.last_name) return 5;
    if (!candidateDoc.contact_number) return 6;
    if (!candidateDoc.why_work) return 7;
    if (!candidateDoc.availability_day) return 8;
    if (!candidateDoc.nationality) return 9;
    if (!candidateDoc.current_currency) return 10;
    if (!candidateDoc.current_salary) return 11;
    if (!candidateDoc.expected_salary) return 12;
    if (!candidateDoc.expected_salary_currency) return 13;
    if (!candidateDoc.description) return 14;
    if (!candidateDoc.locations) return 15;
    if (candidateDoc.locations && candidateDoc.locations.length === 0) return 16;
    if (!candidateDoc.roles) return 17;
    if (candidateDoc.roles && candidateDoc.roles.length === 0) return 18;
    if (userDoc.candidate && !userDoc.candidate.base_city) return 19;
    if (userDoc.candidate && !userDoc.candidate.base_country) return 20;

    return 1;
}

// This function will undo the migration
module.exports.down = async function() {
    totalDocsToProcess = await Users.find({type : 'candidate'}).count();
    logger.debug(totalDocsToProcess);

    const userCursor = await Users.find({type : 'candidate'}).cursor();
    let userDoc = await userCursor.next();

    for ( null ; userDoc !== null; userDoc = await userCursor.next()) {
        totalProcessed++;
        logger.debug("(" + totalProcessed + "/" + totalDocsToProcess + ") Migrating user: " + userDoc._id.toString());

        if (userDoc.candidate && userDoc.candidate.status && userDoc.candidate.status.length > 0) {
            let isApproved;
            if (userDoc.candidate.status[0].status === "approved") {
                isApproved = 1;
            } else {
                isApproved = 0;
            }
            const createdStatus = userDoc.candidate.status.find(function(status) {
                return status.status === "created"
            });

            let updateObj = {
                $set: { created_date: createdStatus.timestamp, is_approved: isApproved},
                $unset: { "candidate.status": 1, first_approved_date: 1}
            };

            logger.debug("user doc update", updateObj);
            const update = await Users.update({_id: userDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
        }
    }
    logger.debug('Total users docs to process: ' + totalDocsToProcess);
    logger.debug('Total processed: ' + totalProcessed);
    logger.debug('Total modified: ' + totalModified);
}