const crypto = require('../../../services/crypto');
const mongooseReferral = require('../../../../model/mongoose/referral');
const errors = require('../../../services/errors');

module.exports = async function(req, res) {
    const refDoc = await mongooseReferral.findOneByEmail(req.body.email);

    if(refDoc) {
        res.send(refDoc);
    }
    else {
        let token = crypto.getRandomString(10);
        token = token.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
        let newDoc, i=0, totalIterations = 3;
        newDoc = await mongooseReferral.findOne({url_token : token});
        if(newDoc) {
            let newDocs;
            while(!newDocs && i < totalIterations){
                i++;
                token = crypto.getRandomString(10);
                token = token.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
                newDocs = await mongooseReferral.findOne({url_token : token});
            }
        }

        if(i === totalIterations){
            errors.throwError("Unable to generate referral code" , 400)
        }

        const newInsertDoc = await mongooseReferral.insert({
            email: req.body.email,
            url_token: token,
            date_created: new Date(),
        });
        res.send(newInsertDoc);
    }
};