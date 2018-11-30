const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const EmployerProfile = require('../../../model/employer_profile');
const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');
const autoNotificationEmail = require('../email/emails/companyAutoNotification');

const logger = require('../logger');
const errors = require('../errors');

module.exports = async function (req, res) {
    console.log("executed");
    let companyCursor = await EmployerProfile.find({ saved_searches: { $exists: true, $ne : [] } , "saved_searches.0.when_receive_email_notitfications" : {$ne: "Never"}}).cursor();
    let companyDoc = await companyCursor.next();
    console.log("companyDoc");
    for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
        //console.log(companyDoc);
        const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'company' , _id : companyDoc._creator  }).lean();
        console.log(userDoc);
        if(userDoc) {
            console.log(companyDoc.last_email_sent);
            console.log(new Date(Date.now() - convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000));
            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(Date.now() - convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) {

                const savedSearch = companyDoc.saved_searches;
                let candidateDocs = await candidateSearch.candidateSearch({
                    is_verify: 1,
                    status: 'approved',
                    disable_account: false,
                    firstApprovedDate: companyDoc.last_email_sent
                }, {
                    skills: savedSearch.skills,
                    locations: savedSearch.locations,
                    positions: savedSearch.positions,
                    blockchains: savedSearch.blockchains,
                    salary: {
                        current_currency: savedSearch.current_currency,
                        current_currency: savedSearch.current_currency
                    },
                    availability_day: savedSearch.availability_day
                });

                console.log(candidateDocs);
                if(candidateDocs.candidates) {
                    let candidateList = [];
                    for ( let i = 0 ; i < candidateDocs.candidates.length; i++) {
                        if(candidateDocs.candidates[i]._creator.first_approved_date) {
                            let candidateInfo = {
                                url : candidateDocs.candidates[i]._creator._id,
                                why_work : candidateDocs.candidates[i].why_work,
                                initials : candidateDocs.candidates[i].first_name.charAt(0).toUpperCase() + candidateDocs.candidates[i].last_name.charAt(0).toUpperCase(),
                                programming_languages : candidateDocs.candidates[i].programming_languages
                            }
                            candidateList.push(candidateInfo);
                            console.log("Candidate list : " + candidateList);
                        }
                        else {
                            logger.debug("do nothing");
                        }
                    }

                    let candidates;
                    if(candidateDocs.count > 0) {
                        if(candidateDocs.count  <= 10) {
                            candidates = {"count" : candidateDocs.count  , "list" : candidateList};
                        }
                        else {
                            candidates = {"count" : 'more than 10' , "list" : candidateList.slice(0, 10)};
                        }
                        autoNotificationEmail.sendEmail(userDoc[0].email , companyDoc.first_name , companyDoc.company_name,candidates,userDoc[0].disable_account);
                        await EmployerProfile.update({_creator : companyDoc._creator} , {$set : {'last_email_sent' : new Date()}});
                    }
                    else {
                        logger.debug("Candidate list is empty");
                    }

                }
                else {
                    console.log("else");
                    console.log("Company Name : " + companyDoc.company_name);
                    console.log("Company ID : " + companyDoc._id);
                    logger.debug("No candidate match with search query");
                }
            }

        }
        else {
            console.log("else");
            errors.throwError("User doc not found", 404);
        }
    }

    res.send({
        success : true
    })


}



const convertToDays = module.exports.convertToDays = function convertToDays(when_receive_email_notitfications) {
    switch(when_receive_email_notitfications) {
        case "Weekly":
            return 7;
            break;
        case "3 days":
            return 3;
            break;
        case "Daily":
            return 1;
            break;
        default :
            return 0;
            break;
    }
};

