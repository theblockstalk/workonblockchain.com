const Schema = require('mongoose').Schema;
const mongooseReferral = require('../../../model/mongoose/referral');
const errors = require('../../services/errors');
const users = require('../../../model/mongoose/users');
const employerProfile = require('../../../model/mongoose/company');

module.exports.request = {
    type: 'get',
    path: '/referral/'
};

const querySchema = new Schema({
    ref_code: {
        type: String,
        required: true
    }
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.endpoint = async function (req, res) {
    let discount;
    let outputParams = {};
    const refDoc = await mongooseReferral.findOne({
        url_token:req.query.ref_code
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
        res.send(outputParams);
    }
    else{
        errors.throwError("Referral doc not found", 404);
    }
}