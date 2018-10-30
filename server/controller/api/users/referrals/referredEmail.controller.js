const referral = require('../../../../model/referrals');
const user = require('../../../../model/users');
const employerProfile = require('../../../../model/employer_profile');
const candidateProfile = require('../../../../model/candidate_profile');

const referedUserEmail = require('../../../services/email/emails/referredFriend');

module.exports = async function (req, res) {
    const refDoc = await referral.findOne({
        _id : req.body.info.referred_id
    }).lean();
    if(refDoc){

        const userDoc = await user.findOne({email : refDoc.email}).lean();
        if(userDoc && userDoc.type){
            if(userDoc.type === 'candidate'){
                const candidateDoc = await candidateProfile.findOne({_creator : userDoc._id}).lean();
                let data = {fname : candidateDoc.first_name , email : refDoc.email , referred_fname : req.body.info. referred_fname , referred_lname: req.body.info.referred_lname }
                referedUserEmail.sendEmail(data, userDoc.disable_account);

                res.send({
                    success : true
                });

            }
            if(userDoc.type === 'company'){
                const companyDoc = await employerProfile.findOne({_creator : userDoc._id}).lean();
                let data = {fname : companyDoc.first_name , email : refDoc.email , referred_fname : req.body.info. referred_fname , referred_lname: req.body.info.referred_lname }
                referedUserEmail.sendEmail(data, userDoc.disable_account);

                res.send({
                    success : true
                });

            }
        }
        else
        {
            let data = {email : refDoc.email , referred_fname : req.body.info. referred_fname , referred_lname: req.body.info.referred_lname }
            referedUserEmail.sendEmail(data, false);

            res.send({
                success: false
            });
        }

    }
    else
    {
        res.send({
            success: false
        });
    }


};