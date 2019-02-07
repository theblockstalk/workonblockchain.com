const crypto = require('../../../services/crypto');

const mongooseReferral = require('../../../../model/mongoose/referral');

module.exports = async function(req, res) {
    const refDoc = await mongooseReferral.findOneByEmail(req.body.email);

    if(refDoc) {
        res.send(refDoc);
    }
    else {
        let token = crypto.getRandomString(10);
        token = token.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
        const uniqueToken = await isPrime(token);
        if(uniqueToken) {
            const newDoc = await mongooseReferral.insert({
                email: req.body.email,
                url_token: uniqueToken,
                date_created: new Date(),
            });
            res.send(newDoc);
        }
    }
};

async function isPrime(token){
    const newDoc = await mongooseReferral.findOne({url_token : token});
    if(newDoc) {
        let newToken = crypto.getRandomString(10);
        newToken = newToken.replace('+', 1).replace('-',2).replace('/',3).replace('*',4).replace('#',5).replace('=',6);
        return isPrime(newToken);
    }
    else{
        return token;
    }
}