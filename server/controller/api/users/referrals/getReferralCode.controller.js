const crypto = require('crypto');
const referral = require('../../../../model/referrals');
const user = require('../../../../model/users');
const employerProfile = require('../../../../model/employer_profile');
const candidateProfile = require('../../../../model/candidate_profile');

module.exports = async function (req, res) {
    //console.log(req.body)
    const refDoc = await referral.findOne({
        url_token:req.body.code
    }).lean();
    //console.log("refDoc");
    //console.log(refDoc);
    if(refDoc){
        const userDoc = await user.findOne({email : refDoc.email}).lean();
        //console.log("userDoc");
        //console.log(userDoc);
        if(userDoc){
            //console.log("if");
            if(userDoc.type === 'candidate'){
                const candidateDoc = await candidateProfile.findOne({_creator : userDoc._id}).lean();
                if(candidateDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : candidateDoc.first_name,
                        referred_id : refDoc._id
                    });
                }
				else{
					res.send({
                        name : refDoc.email,
                        referred_id : refDoc._id
                    });
				}
            }
            if(userDoc.type === 'company'){
                const employerDoc = await employerProfile.findOne({_creator : userDoc._id}).lean();
                if(employerDoc.first_name){
                    res.send({
                        email : userDoc.email,
                        name : employerDoc.first_name,
                        referred_id : refDoc._id
                    });
                }
				else{
					res.send({
                        name : refDoc.email,
                        referred_id : refDoc._id
                    });
				}
            }
        }
        else
        {
            //console.log("else");
            res.send({
                email: refDoc.email,
                referred_id : refDoc._id
            });
        }
    }
};