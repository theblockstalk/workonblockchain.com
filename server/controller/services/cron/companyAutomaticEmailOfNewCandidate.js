const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');
const logger = require('../logger');
const errors = require('../errors');

module.exports = async function (req, res) {

    const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'company' });
    if(userDoc && userDoc.length > 0) {
        for(let i=0; i < userDoc.length; i++) {
            let queryString = [];
            if(userDoc[i].saved_searches[0].last_email_sent  < now - when_receive_email_notitfications) { // not sure about this
                if (userDoc[i].saved_searches[0] && userDoc[i].saved_searches[0].length > 0 && userDoc[i].saved_searches[0].receive_email_notitfications === true) {
                    if (userDoc[i].saved_searches[0].location) {
                        const locationFilter = {"locations": {$in: userDoc[i].saved_searches[0].location}};
                        queryString.push(locationFilter);
                    }
                    if (userDoc[i].saved_searches[0].position) {
                        const rolesFilter = {"roles": {$in: userDoc[i].saved_searches[0].position}};
                        queryString.push(rolesFilter);
                    }
                    if (userDoc[i].saved_searches[0].current_currency && userDoc[i].saved_searches[0].current_salary) {
                        const currentSalaryFilter = {
                            $and: {
                                "current_currency": userDoc[i].saved_searches[0].current_currency,
                                "current_salary": userDoc[i].saved_searches[0].current_salary
                            }
                        };
                        queryString.push(currentSalaryFilter);
                    }

                    if (userDoc[i].saved_searches[0].blockchain) {
                        const platformFilter = {
                            $or: [
                                {"commercial_platform.platform_name": {$in: userDoc[i].saved_searches[0].blockchain}},
                                {"platforms.platform_name": {$in: userDoc[i].saved_searches[0].blockchain}}
                            ]
                        };
                        queryString.push(platformFilter);
                    }

                    if (userDoc[i].saved_searches[0].skills) {
                        const skillsFilter = {"programming_languages.language": userDoc[i].saved_searches[0].skills};
                        queryString.push(skillsFilter);
                    }
                    if (userDoc[i].saved_searches[0].availability_day) {
                        const availabilityFilter = {"availability_day": userDoc[i].saved_searches[0].availability_day};
                        queryString.push(availabilityFilter);
                    }
                    const searchQuery = {$and: queryString};
                    if (queryString && queryString > 0) {
                        const candidateDoc = await CandidateProfile.find(searchQuery).populate('_creator').lean();
                        if(candidateDoc._creator.is_approved === 1 &&
                            candidateDoc._creator.candidate.first_approved_date > userDoc[i].saved_searches[0].last_email_sent
                            && candidateDoc._creator.candidate.first_approved_date < new Date()
                            ) { //please confirm this if condition
                            //sendEmail
                            res.send({
                                success : true
                            })
                        }
                        else {
                            errors.throwError("No saved searches", 404);
                        }
                    }
                    else {
                        errors.throwError("No filter applied", 404);
                    }

                }
            }
            else {
                errors.throwError("Email sent already", 404);
            }
        }

    }
    else {
        errors.throwError("User not found", 404);
    }


}