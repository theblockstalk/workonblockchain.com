const crypto = require('crypto');
const referral = require('../../../../model/referrals');
const user = require('../../../../model/users');
const employerProfile = require('../../../../model/employer_profile');
const candidateProfile = require('../../../../model/candidate_profile');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const userId = req.auth.user;

    if(userId.is_admin === 1){
        const refDoc = await referral.findOne({
            _id:req.body.id
        }).lean();
        if(refDoc){
            const userDoc = await user.findOne({email : refDoc.email}).lean();
            if(userDoc){
                if(userDoc.type === 'candidate'){
                    const candidateDoc = await candidateProfile.findOne({_creator : userDoc._id}).lean();

                    res.send({
                        candidateDoc :  candidateDoc
                    });

                }
                if(userDoc.type === 'company'){
                    const employerDoc = await employerProfile.findOne({_creator : userDoc._id}).lean();

                    res.send({
                        companyDoc : employerDoc,
                    });
                }
            }
            else
            {
                res.send({
                    refDoc : refDoc
                });
            }
        }
        else
        {
            res.send({
                success : false
            });
        }

    }
    else
    {
        errors.throwError("User is not authorized to access this detail", 401);
    }

};