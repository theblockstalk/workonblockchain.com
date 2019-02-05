const company = require('../../../model/mongoose/company');
const users = require('../../../model/mongoose/users');

const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');
const autoNotificationEmail = require('../email/emails/companyAutoNotification');

const settings = require('../../../settings');
const logger = require('../logger');
const filterReturnData = require('../../api/users/filterReturnData');

module.exports = async function () {
    logger.debug('Running candidate auto-notification for company cron');

    await company.findAndIterate({
        saved_searches: { $exists: true, $ne : [] },
        "saved_searches.0.when_receive_email_notitfications": {$ne: "Never"}
    }, async function (companyDoc) {
        const userDoc = await users.findOne({_id : companyDoc._creator});
        if(userDoc && (userDoc.is_approved !== 1 || userDoc.disable_account) ) {
            logger.debug("Company is disabled, or not approved");
        }
        else if(userDoc) {
            logger.debug("Checking company " + companyDoc.company_name + " with user_id " + userDoc._id);
            const timestamp = Date.now();
            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(timestamp - convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) {

                const savedSearch = companyDoc.saved_searches[0];
                let blacklist = [];
                for (let candidateSent of companyDoc.candidates_sent_by_email) {
                    blacklist.push(candidateSent.user);
                }
                let candidateDocs
                try {
                    candidateDocs = await candidateSearch.candidateSearch({
                        is_verify: 1,
                        status: 'approved',
                        disable_account: false,
                        blacklist: blacklist
                    }, {
                        skills: savedSearch.skills,
                        locations: savedSearch.location,
                        positions: savedSearch.position,
                        blockchains: savedSearch.blockchain,
                        salary: {
                            current_currency: savedSearch.current_currency,
                            current_salary: savedSearch.current_salary
                        },
                        availability_day: savedSearch.availability_day
                    });

                    let candidateList = [];
                    let candidateLog = [];
                    for ( let i = 0 ; i < candidateDocs.candidates.length; i++) {
                        const candidate = candidateDocs.candidates[i];
                        const url = settings.CLIENT.URL + 'candidate-detail?user=' + candidate._id;
                        const candidateInfo = {
                            url: url,
                            why_work: candidate.candidate.why_work,
                            initials: filterReturnData.createInitials(candidate.first_name, candidate.last_name),
                            programming_languages: candidate.candidate.programming_languages
                        };
                        candidateList.push(candidateInfo);
                        candidateLog.push({
                            user: candidate._id,
                            sent: timestamp
                        })
                    }

                    let candidates;
                    if(candidateDocs.count > 0) {
                        if(candidateDocs.count  <= 10) {
                            candidates = {"count" : candidateDocs.count  , "list" : candidateList};
                        }
                        else {
                            candidates = {"count" : 'More than 10' , "list" : candidateList.slice(0, 10)};
                        }
                        await autoNotificationEmail.sendEmail(userDoc.email , companyDoc.first_name , companyDoc.company_name,candidates,userDoc.disable_account);
                        await company.update({_creator : companyDoc._creator} , {
                            $set : {'last_email_sent' : timestamp},
                            $push: {'candidates_sent_by_email': candidateLog}
                        });
                    }
                    else {
                        logger.debug("Candidate list is empty");
                    }
                } catch (error) {
                    if (error.code === 404) {
                        logger.debug("No candidates found");
                    } else {
                        logger.error(error.message, {
                            stack: error.stack,
                            name: error.name
                        })
                    }
                }
            } else {
                logger.debug("Company has recently been sent an email");
            }
        }
        else {
            logger.error("User doc not found for company " + companyDoc._id);
        }
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

