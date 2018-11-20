const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');
const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');

const logger = require('../logger');
const errors = require('../errors');

module.exports = async function (req, res) {

    const companyDoc = await EmployerProfile.find({ saved_searches: { $exists: true, $ne : [] }}).lean();
    console.log(companyDoc);
    if(companyDoc && companyDoc.length > 0 ) {
      for (let i=0 ; i < companyDoc.length ; i++) {
          const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'company', _id : companyDoc[i]._creator }).lean();
          if(userDoc) {
              let queryString = [];
              if(companyDoc[i].saved_searches.when_receive_email_notitfications !== 'Never' && companyDoc[i].saved_searches[0].receive_email_notitfications === true) {
                  if(!companyDoc[i].last_email_sent || companyDoc[i].last_email_sent  <  new Date(Date.now() + candidateSearch.convertToDays(companyDoc[i].saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) { // not sure about this
                          if (companyDoc[i].saved_searches[0].location) {
                              const locationFilter = {"locations": {$in: companyDoc[i].saved_searches[0].location}};
                              queryString.push(locationFilter);
                          }
                          if (companyDoc[i].saved_searches[0].position) {
                              const rolesFilter = {"roles": {$in: companyDoc[i].saved_searches[0].position}};
                              queryString.push(rolesFilter);
                          }
                          if (companyDoc[i].saved_searches[0].current_currency && companyDoc[i].saved_searches[0].current_salary) {
                              const currentSalaryFilter = {
                                  $and: {
                                      "current_currency": companyDoc[i].saved_searches[0].current_currency,
                                      "current_salary": companyDoc[i].saved_searches[0].current_salary
                                  }
                              };
                              queryString.push(currentSalaryFilter);
                          }

                          if (companyDoc[i].saved_searches[0].blockchain) {
                              const platformFilter = {
                                  $or: [
                                      {"commercial_platform.platform_name": {$in: companyDoc[i].saved_searches[0].blockchain}},
                                      {"platforms.platform_name": {$in: companyDoc[i].saved_searches[0].blockchain}}
                                  ]
                              };
                              queryString.push(platformFilter);
                          }

                          if (companyDoc[i].saved_searches[0].skills) {
                              const skillsFilter = {"programming_languages.language": companyDoc[i].saved_searches[0].skills};
                              queryString.push(skillsFilter);
                          }
                          if (companyDoc[i].saved_searches[0].availability_day) {
                              const availabilityFilter = {"availability_day": companyDoc[i].saved_searches[0].availability_day};
                              queryString.push(availabilityFilter);
                          }
                          const searchQuery = {$and: queryString};
                          if (queryString && queryString > 0) {
                              const candidateDoc = await CandidateProfile.find(searchQuery).populate('_creator').lean();
                              if(candidateDoc && candidateDoc._creator.is_approved === 1 && candidateDoc._creator.first_approved_date) { //please confirm this if condition
                                  let candidateList = [];

                                  for(let a=0 ; a < candidateDoc.length ; a++) {
                                      let candidateInfo = {
                                          profileLink : candidateDoc[i]._creator._id,
                                          whyWork : candidateDoc[i].why_work,
                                          initials : candidateDoc[i].first_name.charAt(0).toUpperCase() + candidateDoc[i].last_name.charAt(0).toUpperCase()
                                      }
                                      candidateList.push(candidateInfo);
                                  }
                                  if(candidateList.length > 0){
                                      //sendEmail
                                      await EmployerProfile.update({_creator : userDoc._id} , {$set : {'last_email_sent' : new Date()}});
                                      res.send({
                                          success : true
                                      })
                                  }
                                  else {
                                      errors.throwError("Candidate doc not found", 404);
                                  }

                              }
                              else {
                                  errors.throwError("User is not approved", 404);
                              }
                          }
                          else {
                              errors.throwError("Search query is empty", 404);
                          }

                  }
              }

              else {
                  errors.throwError("Receive email notification is false", 404);
              }
          }
          else {
              errors.throwError("User doc not found", 404);
          }
      }
    }
    else {
        errors.throwError("Company doc not found", 404);
    }

}