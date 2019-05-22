const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const crypto = require('../../../../server/controller/services/crypto');
const mongooseReferral = require('../../../model/mongoose/referral');
const errors = require('../../services/errors');

module.exports.request = {
    type: 'get',
    path: '/referral/'
};

const querySchema = new Schema({
    email: String,
    admin: Boolean
})

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    if(req.query.admin) await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    console.log(req.query);
    const refDoc = await mongooseReferral.findOneByEmail(req.query.email);

    if(refDoc) {
        res.send(refDoc);
    }
    else {
        let token = crypto.getRandomString(10);
        token = token.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
        let newDoc, i=0, newDocs;
        newDoc = await mongooseReferral.findOne({url_token : token});
        while(newDocs && i < 3){
            i++;
            token = crypto.getRandomString(10);
            token = token.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
            newDocs = await mongooseReferral.findOne({url_token : token});
        }

        if (newDoc){
            errors.throwError("Unable to generate referral code" , 400)
        }

        const newInsertDoc = await mongooseReferral.insert({
            email: req.query.email,
            url_token: token,
            date_created: new Date(),
        });
        res.send(newInsertDoc);
    }
}