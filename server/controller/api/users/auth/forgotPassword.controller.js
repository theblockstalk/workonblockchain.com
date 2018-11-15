const settings = require('../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const logger = require('../../../services/logger');
const EmployerProfile = require('../../../../model/employer_profile');
const jwtToken = require('../../../services/jwtToken');
const errors = require('../../../services/errors');

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
            await User.update({ _id: mongo.helper.toObjectID(userDoc._id) },{ $set: {'forgot_password_key': forgotPasswordToken } });
            res.send({
                success : true
            })
        }
    }
    else {
        errors.throwError("User not found", 404);
    }

}
