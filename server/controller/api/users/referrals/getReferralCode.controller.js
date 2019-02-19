const crypto = require('crypto');
const referral = require('../../../../model/mongoose/referral');
const users = require('../../../../model/mongoose/users');
const employerProfile = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

module.exports = async function (req, res) {
    let discount;
    let outputParams = {};
    const refDoc = await referral.findOne({
        url_token:req.body.code
    });

    if(refDoc){
        if(refDoc.discount) outputParams.discount = refDoc.discount;
        outputParams.email = refDoc.email;
        outputParams.referred_id = refDoc._id;

        const userDoc = await users.findOneByEmail(refDoc.email);

        if(userDoc){
            if(userDoc.type === 'candidate'){
                if(userDoc.first_name) outputParams.name = userDoc.first_name;
            }
            if(userDoc.type === 'company'){
                const employerDoc = await employerProfile.findOne({_creator : userDoc._id});
                if(employerDoc.first_name) outputParams.name = employerDoc.first_name;
            }
        }
        console.log(outputParams);
        res.send(outputParams);
    }
    else{
        errors.throwError("Referral doc not found", 404);
    }
};