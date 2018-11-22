const crypto = require('../../../services/crypto');

const mongooseReferral = require('../../../../model/mongoose/referral');

module.exports = async function(req, res) {
    const refDoc = await mongooseReferral.findOneByEmail(req.body.email);

    if(refDoc) {
        res.send(refDoc);
    }
    else {
        const token = crypto.getRandomString(10);
        const newDoc = await mongooseReferral.insert({
            email : req.body.email,
            url_token : token,
            date_created: new Date(),
        });
		res.send(newDoc);
    }
};