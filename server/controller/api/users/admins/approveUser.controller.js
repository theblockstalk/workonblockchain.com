const users = require('../../../../model/mongoose/users');
const companies  = require('../../../../model/mongoose/company');
const errors = require('../../../services/errors');

const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');
const companyApprovedEmail = require('../../../services/email/emails/companyApproved');

module.exports = async function (req, res) {

    const querybody = req.body;
    const userId = req.params._id;
    await users.update({ _id:  userId },{ $set: {'is_approved': querybody.is_approve} });
    const userDoc = await users.findOneById(userId);
    if(userDoc && userDoc.is_approved === 1 && userDoc.type === 'company') {
            const companyDoc = await companies.findOne({ _creator: userDoc._id});
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
    else {
        res.send({
            success : true
        })
    }

}
