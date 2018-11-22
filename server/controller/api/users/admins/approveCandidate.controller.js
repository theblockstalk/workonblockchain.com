const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const errors = require('../../../services/errors');

const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');

module.exports = async function (req, res) {

    const querybody = req.body;
    const userId = req.params._id;
    let userRes;

    const userDoc = await User.findOne({ _id: userId}).lean();
    if(userDoc) {
        if(req.body.status === 'Approved' || req.body.status === 'approved' || req.body.status === 'Other' || req.body.status === 'other') {
            userRes = await
            User.update({_id: userDoc._id},
                {
                    $push: {
                        'candidate.status': {
                            $each: [{
                                status: req.body.status,
                                status_updated: new Date(),
                                timestamp: new Date()
                            }],
                            $position: 0
                        }
                    }
                }
            );
            if(userDoc.first_approved_date){}
            else {
                await
                User.update({_id: userDoc._id}, {$set: {'first_approved_date': new Date()}});
            }
         }
        else{
            userRes = await
            User.update({_id: userDoc._id},
                {
                    $push: {
                        'candidate.status': {
                            $each: [{
                                status: req.body.status,
                                status_updated: new Date(),
                                reason: req.body.reason,
                                timestamp: new Date()
                            }],
                            $position: 0
                        }
                    }
                }
            );
        }
        if(userRes) {
            if(userDoc.type === 'candidate')
            {
                const candidateDoc = await CandidateProfile.findOne({ _creator: userDoc._id}).lean();
                if(candidateDoc) {
                    candidateApprovedEmail.sendEmail(userDoc.email, candidateDoc.first_name,userDoc.disable_account);
                    res.send({
                        success : true
                    })
                }
                else {
                    errors.throwError("Candidate account not found", 404)
                }
            }
        }
        else {
            res.send({
                success : false
            })
        }
    }
    else {
        errors.throwError("User not found", 404)
    }


}
