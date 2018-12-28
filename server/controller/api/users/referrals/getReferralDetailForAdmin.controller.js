const referral = require('../../../../model/referrals');
const user = require('../../../../model/users');
const employerProfile = require('../../../../model/employer_profile');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const userId = req.auth.user;

    if(userId.is_admin === 1){
        const refDoc = await referral.findOne({
            email:req.body.email
        }).lean();
        if(refDoc){
            const userDoc = await user.findOne({email : refDoc.email}).lean();
            if(userDoc){
                if(userDoc.type === 'candidate'){
                    res.send({
                        candidateDoc :  userDoc
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
            errors.throwError("Referral doc not found", 404);
        }

    }
    else
    {
        errors.throwError("User is not authorized to access this detail", 401);
    }

};