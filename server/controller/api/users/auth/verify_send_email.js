const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const errors = require('../../../services/errors');

module.exports = async function verify_send_email(emailAddress, verifyEmailToken) {
    const userDoc = await User.findOne({ email :emailAddress }).lean();
    if(userDoc) {
        if(userDoc.type === 'candidate') {
            let name;
            const candidateDoc = await CandidateProfile.find({_creator : userDoc._id}).populate('_creator').lean();
            if(candidateDoc && candidateDoc.length > 0 ) {
                if(candidateDoc[0].first_name) {
                    name = candidateDoc[0].first_name;
                }
                else {
                    name = null;
                }
                verifyEmailEmail.sendEmail(userDoc.email, name ,verifyEmailToken);
                return true;
            }
            else {
                verifyEmailEmail.sendEmail(userDoc.email, null ,verifyEmailToken);
                return true;
            }
        }
        if(userDoc.type === 'company') {
            let name;
            const companyDoc = await EmployerProfile.find({_creator : userDoc._id}).populate('_creator').lean();
            if(companyDoc && companyDoc.length > 0 ) {
                if(companyDoc[0].first_name) {
                    name = companyDoc[0].first_name;
                }
                else {
                    name = null;
                }
                verifyEmailEmail.sendEmail(userDoc.email, name ,verifyEmailToken);
                return true;
            }
            else {
                verifyEmailEmail.sendEmail(userDoc.email, null ,verifyEmailToken);
                return true;
            }
        }
    }
    else {
        errors.throwError("User not found", 404);
    }


}