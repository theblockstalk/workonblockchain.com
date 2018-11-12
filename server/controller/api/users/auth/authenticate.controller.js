const bcrypt = require('bcryptjs');
const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const Q = require('q');
const jwtToken = require('../../../services/jwtToken');
const crypto = require('crypto');
const logger = require('../../../services/logger');

module.exports = async function (req, res) {

    let userParam = req.body;

    if(userParam.linkedin_id) {
      let userDoc =  await User.findOne({linkedin_id : userParam.linkedin_id }).lean();
      if(userDoc) {
          let jwtToken = jwtToken.createJwtToken(userDoc);
          await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtToken}});
          const candidateDoc = CandidateProfile.findOne({ _creator:  userDoc._id }
          res.send({
              _id:candidateDoc._id,
              _creator: candidateDoc._creator,
              email: userDoc.email,
              email_hash: userDoc.email_hash,
              is_admin:userDoc.is_admin,
              type:userDoc.type,
              is_approved : userDoc.is_approved,
              jwt_token: jwtToken
          });
      }
    }

    else
    {
        let userDoc =  await User.findOne({email : userParam.email }).lean();
        if(userDoc) {
            let hash = crypto.createHmac('sha512', userDoc.salt);
            hash.update(userParam.password);
            let hashedPasswordAndSalt = hash.digest('hex');

            if (hashedPasswordAndSalt === userDoc.password_hash)
            {
                if(userDoc.type === 'candidate') {
                    let jwtToken = jwtToken.createJwtToken(userDoc);
                    await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtToken}});
                    const candidateDoc = CandidateProfile.findOne({ _creator:  userDoc._id }
                    res.send({
                        _id: candidateDoc._id,
                        _creator: candidateDoc._creator,
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtToken
                    });
                }

                if(userDoc.type === 'company') {
                    let jwtToken = jwtToken.createJwtToken(userDoc);
                    await User.update({_id: userDoc._id}, {$set: {'jwt_token': jwtToken}});
                    const companyDoc = EmployerProfile.findOne({ _creator:  userDoc._id }
                    res.send({
                        _id: companyDoc._id,
                        _creator: companyDoc._creator,
                        email: userDoc.email,
                        email_hash: userDoc.email_hash,
                        is_admin: userDoc.is_admin,
                        type: userDoc.type,
                        is_approved: userDoc.is_approved,
                        jwt_token: jwtToken
                    });
                }

            }
            else
            {
                errors.throwError("Incorrect Password" , 400)
            }

        }

    }

}

