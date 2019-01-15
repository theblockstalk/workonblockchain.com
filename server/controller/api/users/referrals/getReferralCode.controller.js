const crypto = require('crypto');
const referral = require('../../../../model/mongoose/referral');
const users = require('../../../../model/mongoose/users');
const employerProfile = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    const refDoc = await referral.findOne({
        url_token:req.body.code
    });

    if(refDoc){
        const userDoc = await users.findOneByEmail(refDoc.email);

        if(userDoc){
            if(userDoc.type === 'candidate'){
                if(userDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : userDoc.first_name,
                        referred_id : refDoc._id
                    });
                }
				else{
					res.send({
                        email : refDoc.email,
                        referred_id : refDoc._id
                    });
				}
            }
            if(userDoc.type === 'company'){
                const employerDoc = await employerProfile.findOne({_creator : userDoc._id});
                if(employerDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : employerDoc.first_name,
                        referred_id : refDoc._id
                    });
                }
				else{
					res.send({
                        email : refDoc.email,
                        referred_id : refDoc._id
                    });
				}
            }
        }
        else
        {
            res.send({
                email: refDoc.email,
                referred_id : refDoc._id
            });
        }
    }
    else{
        errors.throwError("Referral doc not found", 404);
    }
};