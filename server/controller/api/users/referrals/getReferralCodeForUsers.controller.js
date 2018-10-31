const crypto = require('crypto');

const referral = require('../../../../model/referrals');

module.exports = async function (req, res) {
    const refDoc = await referral.findOne({
        email:req.body.email
    }).lean();
    if(refDoc){
        res.send(refDoc);
    }
    else{
        let new_salt = crypto.randomBytes(16).toString('base64');
        let new_hash = crypto.createHmac('sha512', new_salt);
        let token = new_hash.digest('hex');
        token = token.substr(token.length - 10); //getting last 10 characters
        let document = new referral
        ({
            email : req.body.email,
            url_token : token,
            date_created: new Date(),
        });
        const result = await document.save();
        const refData = {
            url_token: token,
            email:req.body.email,
            _id :result._id
        }
		res.send(refData);
    }
};