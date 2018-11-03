const Candidate = require('../model/candidate_profile');
const Users = require('../model/users');
const Referral = require('../model/referrals');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;
let totalreferred = 0;

// This function will perform the migration
module.exports.up = async function() {
    const userCursor = await Users.find().cursor();
    totalDocsToProcess = await Users.find({type : 'candidate'}).count();
    console.log(totalDocsToProcess);
    let userDoc = await userCursor.next();

    for ( null ; userDoc !== null; userDoc = await userCursor.next()) {

        let unset = {};
        let set = {};

        if (userDoc.ref_link && userDoc.email && userDoc.type === 'candidate') {
            totalProcessed++;

            let referralToken = userDoc.ref_link.substr(userDoc.ref_link.length - 10);
            let document = new Referral
            ({
                email : userDoc.email,
                url_token : referralToken,
                date_created: new Date(),
            });
            const refObj = await document.save();
            console.log('  ', refObj);
            console.log("Migrating user: ", userDoc._id);

            let updateObj ;

            let referedUser = await Users.find({_id : userDoc.refered_id}).lean();
            console.log('  ', referedUser);
            console.log('Referred user length : ' +referedUser.length);

            if(referedUser.length > 0)
            {
                updateObj = {
                    $set: {referred_email : referedUser[0].email},
                    $unset: {ref_link: 1 , refered_id : 1}
                };
                totalreferred++;

            }
            else
            {
                updateObj = {
                    $unset: {ref_link: 1 , refered_id : 1}
                };

            }

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
    console.log('Total referred: ', totalreferred);

}

// This function will undo the migration
module.exports.down = async function() {
    let referralCursor = await Referral.find({}).cursor();
    totalDocsToProcess = await Referral.find({}).count();
    let referralDoc = await referralCursor.next();

    const userDoc = await Users.find().lean();


    for ( null ; referralDoc !== null; referralDoc = await referralCursor.next()) {

        console.log('  ' , referralDoc._id);


        if (referralDoc.url_token && referralDoc.email === userDoc.email) {
            totalProcessed++;

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