const Candidate = require('../model/candidate_profile');
const Pages = require('../model/pages_content');

// This function will perform the migration
module.exports.up = async function up() {
    const latestCandidateTermsPage = await Pages.findOne({page_name: 'Terms and Condition for candidate'}).lean();
    const candidateTermsPageId = latestCandidateTermsPage._id;

    let candidateCursor = await Candidate.find({}).cursor();
    for (let candidateDoc = await candidateCursor.next(); candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        console.log("Updating " + candidateDoc._id);
        console.log("  candidate.terms " + candidateDoc.terms);
        if (candidateDoc.terms) {
            candidateDoc.terms_id = candidateTermsPageId;
        }
        delete candidateDoc.terms;
        candidateDoc.save();
    }
}

// This function will undo the migration
module.exports.down = async function down() {
    console.log('Down')
}