const User = require('../../../../model/users');
const EmployerProfile = require('../../../../model/employer_profile');
const errors = require('../../../services/errors');

const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');
const companyApprovedEmail = require('../../../services/email/emails/companyApproved');

module.exports = async function (req, res) {

    const querybody = req.body;
    const userId = req.params._id;
    await User.update({ _id:  userId },{ $set: {'is_approved': querybody.is_approve} });
    const userDoc = await User.findOne({ _id: userId}).lean();
    if(userDoc && userDoc.is_approved === 1) {
        if(userDoc.type === 'candidate')
        {
            candidateApprovedEmail.sendEmail(userDoc.email, userDoc.first_name,userDoc.disable_account);
            res.send({
                success : true
            })


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
                errors.throwError("Company account not found", 404)

            }
        }

    }
    else {
        res.send({
            success : true
        })    }


}
