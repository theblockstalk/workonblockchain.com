const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const enumerations = require('../../../../model/enumerations');
const errors = require('../../../services/errors');
const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');

module.exports = async function (req, res) {
    const userId = req.params._id;
    const userDoc = await User.findOne({_id: userId}).lean();
    const status = req.body.status;
    if (userDoc) {
        const candidateDoc = await
            CandidateProfile.findOne({_creator: userId}).lean();
        if (candidateDoc) {
            let newStatus = {
                status: status,
                status_updated: new Date(),
                timestamp: new Date()
            };
            if (status === 'approved' && !userDoc.first_approved_date) {
                await
                    User.update({_id: userId}, {$set: {'first_approved_date': new Date()}});
            }
            else if (status === 'rejected' || status === 'deferred') {
                const reason = req.body.reason;
                if (!enumerations.statusReasons.includes(reason)) {
                    errors.throwError("Reason " + reason + " not allowed", 400);
                }
                newStatus.reason = reason;
            }
            else if (status === 'other') {}
            else {
                errors.throwError("Status " + status + " now allowed", 400);
            }
            await
                User.update({_id: userDoc._id}, {
                        $push: {
                            'candidate.status': {
                                $each: [newStatus],
                                $position: 0
                            }
                        }
                    }
                );
            if (status === 'approved') {
                candidateApprovedEmail.sendEmail(userDoc.email, candidateDoc.first_name, userDoc.disable_account);
            }
            res.send({
                success: true
            })
        }
        else {
            errors.throwError("Candidate not found", 404)
        }
    }
    else {
        errors.throwError("User not found", 404)
    }
}