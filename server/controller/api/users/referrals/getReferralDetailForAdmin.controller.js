const referral = require('../../../../model/mongoose/referral');
const user = require('../../../../model/mongoose/users');
const employerProfile = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const userId = req.auth.user;

    if(userId.is_admin === 1){
        const refDoc = await referral.findOneByEmail(req.body.email);
        if(refDoc){
            const userDoc = await user.findOneByEmail( refDoc.email );
            if(userDoc){
                if(userDoc.type === 'candidate'){
                    res.send({
                        candidateDoc :  userDoc
                    });

                }
                if(userDoc.type === 'company'){
                    const employerDoc = await employerProfile.findOne({_creator : userDoc._id});

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