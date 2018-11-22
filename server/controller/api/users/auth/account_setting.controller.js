const User = require('../../../../model/users');
const errors = require('../../../services/errors');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');

module.exports = async function (req,res) {
    let user = req.auth.user;
    const queryBody = req.body.status;
    const timestamp = new Date();
    console.log(queryBody);
    if(queryBody.statusName === 'marketingEmail') {
        if(user.type === 'candidate') {
            await CandidateProfile.update({ _creator : user._id },{ $set: {marketing_emails : queryBody.statusValue} });
        }
        if(user.type === 'company') {
            await EmployerProfile.update({ _creator : user._id },{ $set: {marketing_emails : queryBody.statusValue} });
        }
    }
    if(queryBody.statusName === 'disabledAccount') {
        await User.update({ _id: user._id },{ $set: {'disable_account': queryBody.statusValue, 'dissable_account_timestamp' : timestamp } });
    }

    res.send({
        success : true
    })
}
