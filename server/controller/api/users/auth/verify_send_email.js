const User = require('../../../../model/mongoose/users');
const EmployerProfile = require('../../../../model/mongoose/company');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const errors = require('../../../services/errors');

module.exports = async function verify_send_email(emailAddress, verifyEmailToken) {
    const userDoc = await User.findOneByEmail(emailAddress);
    if(userDoc) {
        if(userDoc.type === 'candidate') {
            let name;
            if(userDoc.first_name){
                name = userDoc.first_name;
            }
            else {
                name = null;
            }
            verifyEmailEmail.sendEmail(userDoc.email, null ,verifyEmailToken);
            return true;
        }
        if(userDoc.type === 'company') {
            let name;
            const companyDoc = await EmployerProfile.findOne({_creator : userDoc._id}).populate('_creator');
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