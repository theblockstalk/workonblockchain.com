const Candidate = require('../model/candidate_profile');
const Company = require('../model/employer_profile');
const Pages = require('../model/pages_content');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    const latestCandidateTermsPage = await Pages.findOne({page_name: 'Terms and Condition for candidate'}).lean();
    const candidateTermsPageId = latestCandidateTermsPage._id;

    let candidateCursor = await Candidate.find({}).cursor();
    totalDocsToProcess = await Candidate.find({}).count();
    let candidateDoc = await candidateCursor.next();
    let x = 0;
    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
        totalProcessed++;
        candidateDoc = candidateDoc.toObject();
// if(x === 0) console.log(candidateDoc);
        console.log("Updating " + candidateDoc._id);
        if (candidateDoc.terms) {
            console.log('  Setting terms_id = ' + candidateTermsPageId);
            candidateDoc.terms_id = candidateTermsPageId;
        }
        delete candidateDoc.terms;
        if (!candidateDoc.github_account) {
            console.log('removing github_account field');
            console.log(delete candidateDoc.github_account);
        }
        if (!candidateDoc.stackexchange_account) {
            console.log('removing stackexchange_account field');
            delete candidateDoc.stackexchange_account;
        }
        // if(x === 0) console.log(candidateDoc);

        const update = await Candidate.update({_id: candidateDoc._id}, candidateDoc);
        console.log(update);
        if (update) totalModified++;
        x=1;
    }

    console.log('Total candidates docs to process: ', totalDocsToProcess);
    console.log('Total processed: ', totalProcessed);
    console.log('Total modified: ', totalModified);

    totalProcessed = 0;
    totalModified = 0;

    // const latestCompanyTermsPage = await Pages.findOne({page_name: 'Terms and Condition for company'}).lean();
    // const companyTermsPageId = latestCompanyTermsPage._id;
    //
    // let companyCursor = await Candidate.find({}).cursor();
    // totalDocsToProcess = await Candidate.find({}).count();
    // let companyDoc = await companyCursor.next();
    // for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
    //     totalProcessed++;
    //     companyDoc = companyDoc.toObject();
    //
    //     console.log("Updating " + companyDoc._id);
    //     if (companyDoc.terms) {
    //         console.log('  Setting terms_id = ' + companyTermsPageId);
    //         companyDoc.terms_id = companyTermsPageId;
    //     }
    //     delete companyDoc.terms;
    //
    //     await Company.update({_id: companyDoc._id}, companyDoc);
    //     totalModified++;
    // }
    //
    // console.log('Total company docs to process: ', totalDocsToProcess);
    // console.log('Total processed: ', totalProcessed);
    // console.log('Total modified: ', totalModified);
}

// This function will undo the migration
module.exports.down = async function() {
    console.log('Down')
}