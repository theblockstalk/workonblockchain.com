const crypto = require('crypto');
const referral = require('../../../../model/mongoose/referral');
const users = require('../../../../model/mongoose/users');
const employerProfile = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let discount;

    const refDoc = await referral.findOne({
        url_token:req.body.code
    });

    if(refDoc){
        if(refDoc.discount){
            discount = refDoc.discount;
        }

        const userDoc = await users.findOneByEmail(refDoc.email);

        if(userDoc){
            if(userDoc.type === 'candidate'){
                if(userDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : userDoc.first_name,
                        referred_id : refDoc._id,
                        discount: discount
                    });
                }
				else{
					res.send({
                        email : refDoc.email,
                        referred_id : refDoc._id,
                        discount: discount
                    });
				}
            }
            if(userDoc.type === 'company'){
                const employerDoc = await employerProfile.findOne({_creator : userDoc._id});

                if(employerDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : employerDoc.first_name,
                        referred_id : refDoc._id,
                        discount: discount
                    });
                }
				else{
					res.send({
                        email : refDoc.email,
                        referred_id : refDoc._id,
                        discount: discount
                    });
				}
            }
        }
        else
        {
            res.send({
                email: refDoc.email,
                referred_id : refDoc._id,
                discount: discount
            });
        }
    }
    else{
        errors.throwError("Referral doc not found", 404);
    }
};