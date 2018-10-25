const Candidate = require('../model/candidate_profile');
const Company = require('../model/employer_profile');
const Pages = require('../model/pages_content');

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
    const latestCandidateTermsPage = await Pages.findOne({page_name: 'Terms and Condition for candidate'}).lean();
    const candidateTermsPageId = latestCandidateTermsPage._id;

    let candidateCursor = await Candidate.find({}).cursor();
    totalDocsToProcess = await Candidate.find({}).count();
    let candidateDoc = await candidateCursor.next();

    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        totalProcessed++;

        let unset = {};
        let set = {};
        console.log("Updating " + candidateDoc._id);
        if (candidateDoc.terms) {
            set.terms_id = candidateTermsPageId;
            unset.terms = 1;
        }

        if (candidateDoc.github_account === null) {
            unset.github_account = 1
        }
        if (candidateDoc.stackexchange_account === null) {
            unset.stackexchange_account = 1;
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

    const latestCompanyTermsPage = await Pages.findOne({page_name: 'Terms and Condition for company'}).lean();
    const companyTermsPageId = latestCompanyTermsPage._id;

    let companyCursor = await Company.find({}).cursor();
    totalDocsToProcess = await Company.find({}).count();
    let companyDoc = await companyCursor.next();
    for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
        totalProcessed++;

        console.log("Updating " + companyDoc._id);
        if (companyDoc.terms) {
            const updateObj = {
                $set: {terms_id: companyTermsPageId},
                $unset: {terms: 1}
            };
            console.log('  ', updateObj);
            const update = await Company.update({_id: companyDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
            else console.log('  UPDATE NOT SUCESSFUL');
        }
    }

    console.log('Total company docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    const latestCandidateTermsPage = await Pages.findOne({page_name: 'Terms and Condition for candidate'}).lean();
    const candidateTermsPageId = latestCandidateTermsPage._id;

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

    let companyCursor = await Company.find({}).cursor();
    totalDocsToProcess = await Company.find({}).count();
    let companyDoc = await companyCursor.next();
    for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
        totalProcessed++;

        console.log("Updating " + companyDoc._id);
        if (companyDoc.terms_id) {
            const updateObj = {
                $unset: {terms_id: 1},
                $set: {terms: true}
            };
            console.log('  ', updateObj);
            const update = await Company.update({_id: companyDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
            else console.log('  UPDATE NOT SUCESSFUL');
        }
    }

    console.log('Total company docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);
}