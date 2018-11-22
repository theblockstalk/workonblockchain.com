const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');
const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');

const logger = require('../logger');
const errors = require('../errors');

module.exports = async function (req, res) {

    let companyCursor = await EmployerProfile.find({ saved_searches: { $exists: true, $ne : [] } , "saved_searches.0.when_receive_email_notitfications" : {$ne: "Never"}}).cursor();
    let companyDoc = await companyCursor.next();

    for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
        const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'company', _id : companyDoc._creator }).lean();
        if(userDoc) {
            let queryString = [];
            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(Date.now() + candidateSearch.convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) { // not sure about this
                if (companyDoc.saved_searches[0].location) {
                    const locationFilter = {"locations": {$in: companyDoc.saved_searches[0].location}};
                    queryString.push(locationFilter);
                }
                if (companyDoc.saved_searches[0].position) {
                    const rolesFilter = {"roles": {$in: companyDoc.saved_searches[0].position}};
                    queryString.push(rolesFilter);
                }
                if (companyDoc.saved_searches[0].current_currency && companyDoc.saved_searches[0].current_salary) {
                    const currentSalaryFilter = {
                        $and: {
                            "current_currency": companyDoc.saved_searches[0].current_currency,
                            "current_salary": companyDoc.saved_searches[0].current_salary
                        }
                    };
                    queryString.push(currentSalaryFilter);
                }

                if (companyDoc.saved_searches[0].blockchain) {
                    const platformFilter = {
                        $or: [
                            {"commercial_platform.platform_name": {$in: companyDoc.saved_searches[0].blockchain}},
                            {"platforms.platform_name": {$in: companyDoc.saved_searches[0].blockchain}}
                        ]
                    };
                    queryString.push(platformFilter);
                }

                if (companyDoc.saved_searches[0].skills) {
                    const skillsFilter = {"programming_languages.language": companyDoc.saved_searches[0].skills};
                    queryString.push(skillsFilter);
                }
                if (companyDoc.saved_searches[0].availability_day) {
                    const availabilityFilter = {"availability_day": companyDoc.saved_searches[0].availability_day};
                    queryString.push(availabilityFilter);
                }
                const searchQuery = {$and: queryString};
                if (queryString && queryString > 0) {
                    let candidateCursor = await CandidateProfile.find(searchQuery).populate('_creator').cursor();
                    let candidateDoc = await candidateCursor.next();
                    let candidateList = [];
                    for ( null ; candidateDoc !== null; candidateDoc = await candidateCursor.next()) {
                        if(candidateDoc._creator.first_approved_date) {
                            let candidateInfo = {
                                profileLink : candidateDoc._creator._id,
                                whyWork : candidateDoc.why_work,
                                initials : candidateDoc.first_name.charAt(0).toUpperCase() + candidateDoc.last_name.charAt(0).toUpperCase()
                            }
                            candidateList.push(candidateInfo);
                        }
                        else {
                            logger.debug("do nothing");
                        }
                    }
                    //sendEmail
                    await EmployerProfile.update({_creator : userDoc._id} , {$set : {'last_email_sent' : new Date()}});
                    res.send({
                        success : true
                    })

                    }
                else {
                    errors.throwError("Search query is empty", 400);
                }

            }

        }
        else {
            errors.throwError("User doc not found", 404);
        }
    }
}


