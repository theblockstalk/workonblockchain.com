const settings = require('../../../settings');
var Q = require('q');
const User = require('../../../model/users');
const EmployerProfile = require('../../../model/employer_profile');
const candidateSearch = require('../../../controller/api/users/candidate/searchCandidates');

const logger = require('../logger');
const errors = require('../errors');

module.exports = async function (req, res) {
    console.log("executed");
    let companyCursor = await EmployerProfile.find({ saved_searches: { $exists: true, $ne : [] } , "saved_searches.0.when_receive_email_notitfications" : {$ne: "Never"}}).cursor();
    let companyDoc = await companyCursor.next();
    console.log("companyDoc");
    for ( null ; companyDoc !== null; companyDoc = await companyCursor.next()) {
        const userDoc = await User.find({is_verify : 1 , is_approved : 1 , disable_account : false , type : 'candidate' }).lean();
        if(userDoc) {
            console.log("userDoc");
            let userDocArray = [];

            for (userDetail of userDoc) {
                userDocArray.push(userDetail._id);
            }

            let queryString = [];
            if(!companyDoc.last_email_sent || companyDoc.last_email_sent  <  new Date(Date.now() + candidateSearch.convertToDays(companyDoc.saved_searches[0].when_receive_email_notitfications) * 24*60*60*1000)) { // not sure about this
                let candidateDoc = await candidateSearch.candidateSearchQuery(companyDoc.saved_searches , userDocArray);
                if(candidateDoc) {

                    let candidateList = [];
                    for ( let i = 0 ; i < candidateDoc.length; i++) {
                        if(candidateDoc[i]._creator.first_approved_date) {
                            let candidateInfo = {
                                profileLink : candidateDoc[i]._creator._id,
                                whyWork : candidateDoc[i].why_work,
                                initials : candidateDoc[i].first_name.charAt(0).toUpperCase() + candidateDoc[i].last_name.charAt(0).toUpperCase()
                            }
                            candidateList.push(candidateInfo);
                            console.log("Candidate list : " +candidateList);
                        }
                        else {
                            logger.debug("do nothing");
                        }
                    }
                    //sendEmail
                    await EmployerProfile.update({_creator : companyDoc._creator} , {$set : {'last_email_sent' : new Date()}});

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


