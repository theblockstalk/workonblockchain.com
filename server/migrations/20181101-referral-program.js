const Candidate = require('../model/candidate_profile');
const Users = require('../model/users');
const Referral = require('../model/referrals');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;


function isEmptyObject(obj) {
    for(let prop in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            return false;
        }
    }
    return true;
}

// This function will perform the migration
module.exports.up = async function() {
    const userCursor = await Users.find({}).lean();
    totalDocsToProcess = await Users.find({}).count();
    let userDoc = await userCursor.next();

    for ( null ; userDoc !== null; userDoc = await userCursor.next()) {
        totalProcessed++;

        let unset = {};
        let set = {};
        //console.log("Updating " + candidateDoc._id);
        if (userDoc.refered_id && userDoc.email) {
            set.url_token = userDoc.refered_id;
            set.email = userDoc.email;
            //unset.terms = 1;
        }

        let updateObj;
        if (!isEmptyObject(set) && !isEmptyObject(unset)) {
            updateObj = {$set: set, $unset: unset}
        } else if (!isEmptyObject(set)) {
            updateObj = {$set: set};
        } else if (!isEmptyObject(unset)) {
            updateObj = {$unset: unset};
        }

        if (updateObj) {
            console.log('  ', updateObj);
            const update = await Referral.update({url_token: userDoc.refered_id, email : userDoc.email}, updateObj);
            if (update && update.nModified) totalModified++;
            else console.log('  UPDATE NOT SUCESSFUL');
        }
    }

    console.log('Total candidates docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);

}

// This function will undo the migration
module.exports.down = async function() {
    let candidateCursor = await Candidate.find({}).cursor();
    totalDocsToProcess = await Candidate.find({}).count();
    let candidateDoc = await candidateCursor.next();

    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        totalProcessed++;

        console.log("Updating " + candidateDoc._id);
        if (candidateDoc.terms_id) {
            const updateObj = {
                $unset: {terms_id: 1},
                $set: {terms: true}
            };
            console.log('  ', updateObj);
            const update = await Candidate.update({_id: candidateDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
            else console.log('  UPDATE NOT SUCESSFUL');
        }
    }

    console.log('Total candidates docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);

    totalProcessed = 0;
    totalModified = 0;

}