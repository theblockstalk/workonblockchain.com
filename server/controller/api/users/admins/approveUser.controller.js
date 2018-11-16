const User = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const errors = require('../../../services/errors');

const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');
const companyApprovedEmail = require('../../../services/email/emails/companyApproved');

module.exports = async function (req, res) {

    const querybody = req.body;
    const userId = req.params._id;

    const userDoc = await User.findOne({ _id: userId}).lean();
    if(userDoc) {
        const userRes = await User.update({ _id:  userDoc._id },{ $set: {'is_approved': querybody.is_approve} });
        if(userRes.is_approved === 1) {
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
            if(userDoc.type === 'company') {
                const companyDoc = await EmployerProfile.findOne({ _creator: userDoc._id}).lean();
                if(companyDoc) {
                    companyApprovedEmail.sendEmail(userDoc.email, companyDoc.first_name, userDoc.disable_account);
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
                success : true
            })
        }
    }
    else {
        errors.throwError("User not found", 404)
    }


}
