const users = require('../../../../model/mongoose/users');
const enumerations = require('../../../../model/enumerations');
const errors = require('../../../services/errors');
const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');

module.exports = async function (req, res) {
    const userId = req.params._id;
    const userDoc = await users.findOneById(userId);
    const status = req.body.status;
    if (userDoc) {
        let newStatus = {
            status: status,
            timestamp: new Date()
        };
        if (status === 'approved' && !userDoc.first_approved_date) {
            await users.update({_id: userId}, {$set: {'first_approved_date': new Date()}});
        }
        else if (status === 'rejected' || status === 'deferred') {
            const reason = req.body.reason;
            if (!enumerations.statusReasons.includes(reason)) {
                errors.throwError("Reason " + reason + " not allowed", 400);
            }
            newStatus.reason = reason;
        }
        else if (status === 'other' || status === 'approved') {}
        else {
            errors.throwError("Status " + status + " not allowed", 400);
        }
        await
            users.update({_id: userDoc._id}, {
                    $push: {
                        'candidate.status': {
                            $each: [newStatus],
                            $position: 0
                        }
                    }
                }
            );
        if (status === 'approved') {
            candidateApprovedEmail.sendEmail(userDoc.email, userDoc.first_name, userDoc.disable_account);
        }
        res.send({
            success: true
        })

    }
    else {
        errors.throwError("User not found", 404)
    }
}