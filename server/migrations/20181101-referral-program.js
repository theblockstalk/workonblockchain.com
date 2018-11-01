const Candidate = require('../model/candidate_profile');
const Users = require('../model/users');
const Referral = require('../model/referrals');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    const userCursor = await Users.find({}).lean();
    totalDocsToProcess = await Users.find({}).count();
    let userDoc = await userCursor.next();

    for ( null ; userDoc !== null; userDoc = await userCursor.next()) {
        totalProcessed++;

        let unset = {};
        if (userDoc.ref_link && userDoc.email) {
            let referralToken = userDoc.ref_link.substr(userDoc.ref_link.length - 10);
            let document = new Referral
            ({
                _id :  userDoc.referred_id,
                email : userDoc.email,
                url_token : referralToken,
                date_created: new Date(),
            });
            const refObj = await document.save();
            console.log(refObj);
            unset.ref_link = 1;
            let updateObj = {$unset : unset}

            if (updateObj) {
                console.log('  ', updateObj);
                const update = await Users.update({_id: userDoc._id}, updateObj);
                if (update && update.nModified) totalModified++;
                else console.log('  UPDATE NOT SUCESSFUL');
            }
        }
    }
    console.log('Total users docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);

}

// This function will undo the migration
module.exports.down = async function() {
    let referralCursor = await Referral.find({}).cursor();
    totalDocsToProcess = await Referral.find({}).count();
    let referralDoc = await referralCursor.next();

    const userDoc = await Users.find().lean();


    for ( null ; referralDoc !== null; referralDoc = await referralCursor.next()) {
        totalProcessed++;

        if (referralDoc.url_token && referralDoc.email === userDoc.email) {
            const updateObj = {
                $set: {refered_id: referralDoc._id , ref_link : referralDoc.url_token}
            };
            console.log('  ', updateObj);
            const update = await Users.update({_id: userDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
            else console.log('  UPDATE NOT SUCESSFUL');
        }
    }

    console.log('Total users docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);

    totalProcessed = 0;
    totalModified = 0;

}