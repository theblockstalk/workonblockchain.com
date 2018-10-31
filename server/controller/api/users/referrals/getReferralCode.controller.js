const crypto = require('crypto');
const referral = require('../../../../model/referrals');
const user = require('../../../../model/users');
const employerProfile = require('../../../../model/employer_profile');
const candidateProfile = require('../../../../model/candidate_profile');

module.exports = async function (req, res) {
    console.log("data");
    console.log(req.body)
    const refDoc = await referral.findOne({
        _id:req.body.code
    }).lean();
    console.log(refDoc);
    if(refDoc){
        const userDoc = await user.findOne({email : refDoc.email}).lean();
        //console.log("userDoc");
        console.log(userDoc);
        if(userDoc){
            console.log("if");
            if(userDoc.type === 'candidate'){
                console.log("candidate");
                const candidateDoc = await candidateProfile.findOne({_creator : userDoc._id}).lean();

                    res.send({
                        email : userDoc.email,
                        referred_id : refDoc._id,
                        candidateDoc :  candidateDoc
                    });

            }
            if(userDoc.type === 'company'){
                console.log("compny");
                const employerDoc = await employerProfile.findOne({_creator : userDoc._id}).lean();

                    res.send({
                        email : userDoc.email,
                        companyDoc : employerDoc,
                        referred_id : refDoc._id
                    });
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