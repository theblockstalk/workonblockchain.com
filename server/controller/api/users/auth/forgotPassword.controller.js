const mongo = require('mongoskin');
const User = require('../../../../model/users');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');

module.exports = async function (req,res) {

    let queryBody = req.params;

    const userDoc  = await User.findOne({ email : queryBody.email  }).lean();
    if(userDoc) {
        if(userDoc.social_type === 'GOOGLE')
        {
            errors.throwError("Please login using gmail", 400);
        }

        else if(userDoc.social_type === 'LINKEDIN')
        {
            errors.throwError("Please login using linkedin", 400);
        }

        else {
            let signOptions = {
                expiresIn:  "1h",
            };
            let forgotPasswordToken = jwtToken.createJwtToken(userDoc , signOptions);
            await User.update({ _id: userDoc._id },{ $set: {'forgot_password_key': forgotPasswordToken } });
            if(userDoc.type === 'candidate') {
                let name;
                const candidateDoc = await CandidateProfile.find({_creator : userDoc._id}).populate('_creator').lean();
                if(candidateDoc && candidateDoc.length > 0 && candidateDoc[0].first_name) {
                    name = candidateDoc[0].first_name;
                }
                else
                {
                    name = null;
                }
                forgotPasswordEmail.sendEmail(userDoc.email, name, forgotPasswordToken);
                res.send({
                    success : true
                })
            }
            if(userDoc.type === 'company') {
                let name;
                const companyDoc = await EmployerProfile.find({_creator : userDoc._id}).populate('_creator').lean();
                if(companyDoc && companyDoc.length > 0 ) {
                    name = companyDoc[0].first_name;
                }
                else {
                    name = null;
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
