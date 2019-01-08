const mongo = require('mongoskin');
const User = require('../../../../model/mongoose/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const EmployerProfile = require('../../../../model/mongoose/company');

module.exports = async function (req,res) {

    let queryBody = req.params;

    const userDoc  = await User.findOneByEmail( queryBody.email );
    if(userDoc) {
        if(userDoc.social_type === 'GOOGLE')
        {
            errors.throwError("Please log into your account using the 'Log in with Google' button", 400);
        }

        else if(userDoc.social_type === 'LINKEDIN')
        {
            errors.throwError("Please log into your account using the 'Log in with LinkedIn' button", 400);
        }

        else {
            let signOptions = {
                expiresIn:  "1h",
            };
            let forgotPasswordToken = jwtToken.createJwtToken(userDoc , signOptions);
            await User.update({ _id: userDoc._id },{ $set: {'forgot_password_key': forgotPasswordToken } });
            if(userDoc.type === 'candidate') {
                let name;
                const candidateDoc = await User.findOneById( userDoc._id);
                if(candidateDoc && candidateDoc.first_name) {
                    name = candidateDoc.first_name;

                }

                forgotPasswordEmail.sendEmail(userDoc.email, name, forgotPasswordToken);
                res.send({
                    success : true
                })
            }
            if(userDoc.type === 'company') {
                let name;
                const companyDoc = await EmployerProfile.findOne({_creator : userDoc._id});
                if(companyDoc && companyDoc.length > 0 ) {
                    name = companyDoc[0].first_name;
                }

                forgotPasswordEmail.sendEmail(userDoc.email, name, forgotPasswordToken);
                res.send({
                    success : true
                })
            }
        }
    }
    else {
        errors.throwError("User not found", 404);
    }

}
