const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const crypto = require('../../../../server/controller/services/crypto');
const mongooseReferral = require('../../../model/mongoose/referral');
const errors = require('../../services/errors');
const users = require('../../../model/mongoose/users');
const employerProfile = require('../../../model/mongoose/company');

module.exports.request = {
    type: 'get',
    path: '/referral/'
};

const querySchema = new Schema({
    email: String,
    admin: Boolean,
    ref_code: String
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    if(req.query.admin) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    if(req.query.ref_code){
        console.log('code is here');
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
    else {
        if (req.auth) {
            console.log('some user is calling');
            const userId = req.auth.user;

            if (userId.is_admin === 1) {
                const refDoc = await mongooseReferral.findOneByEmail(req.query.email);
                if (refDoc) {
                    const userDoc = await users.findOneByEmail(refDoc.email);
                    if (userDoc) {
                        if (userDoc.type === 'candidate') {
                            res.send({
                                candidateDoc: userDoc
                            });

                        }
                        if (userDoc.type === 'company') {
                            const employerDoc = await employerProfile.findOne({_creator: userDoc._id});

                            res.send({
                                companyDoc: employerDoc,
                            });
                        }
                    }
                    else {
                        res.send({
                            refDoc: refDoc
                        });
                    }
                }
                else errors.throwError("Referral doc not found", 404);

            }
            else errors.throwError("User is not authorized to access this detail", 401);
        }
        else {
            if(req.query.email) {
                console.log('in else');
                const refDoc = await mongooseReferral.findOneByEmail(req.query.email);
                console.log(refDoc);

                if (refDoc) {
                    res.send(refDoc);
                }
                else {
                    let token = crypto.getRandomString(10);
                    token = token.replace('+', 1).replace('-', 2).replace('/', 3).replace('*', 4).replace('#', 5).replace('=', 6);
                    let newDoc, i = 0, newDocs;
                    newDoc = await mongooseReferral.findOne({url_token: token});
                    while (newDocs && i < 3) {
                        i++;
                        token = crypto.getRandomString(10);
                        token = token.replace('+', 1).replace('-', 2).replace('/', 3).replace('*', 4).replace('#', 5).replace('=', 6);
                        newDocs = await mongooseReferral.findOne({url_token: token});
                    }

                    if (newDoc) {
                        errors.throwError("Unable to generate referral code", 400)
                    }

                    const newInsertDoc = await mongooseReferral.insert({
                        email: req.query.email,
                        url_token: token,
                        date_created: new Date(),
                    });
                    res.send(newInsertDoc);
                }
            }
        }
    }
}