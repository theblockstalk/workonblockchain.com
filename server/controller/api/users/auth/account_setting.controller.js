const User = require('../../../../model/mongoose/users');
const errors = require('../../../services/errors');
const EmployerProfile = require('../../../../model/mongoose/company');

module.exports = async function (req,res) {
    let user = req.auth.user;
    const queryBody = req.body.status;
    const timestamp = new Date();
    if(queryBody.statusName === 'marketingEmail') {
        if(user.type === 'candidate') {
            await User.update({ _id : user._id },{ $set: {marketing_emails : queryBody.statusValue} });
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
