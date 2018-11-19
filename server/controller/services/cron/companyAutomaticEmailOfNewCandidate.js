const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');
const logger = require('../logger');

module.exports = async function (req, res) {

    const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'company' });
    //console.log(userDoc);
    if(userDoc && userDoc.length > 0) {
        for(let i=0; i < userDoc.length; i++){
            let queryString = [];
            if(userDoc[i].saved_searches[0] && userDoc[i].saved_searches[0].length > 0 && userDoc[i].saved_searches[0].receive_email_notitfications === true) {
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

            }
            else {
                logger.debug("nothing to do");
            }
        }

    }
    else {
        logger.debug("nothing to do");
    }


}