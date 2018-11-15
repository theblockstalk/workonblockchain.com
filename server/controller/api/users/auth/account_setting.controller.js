var _ = require('lodash');
const User = require('../../../../model/users');
const errors = require('../../../services/errors');

module.exports = async function (req,res) {

    let userId = req.auth.user._id;
    const queryBody = req.body;
    const timestamp = new Date();
    await User.update({ _id:userId },{ $set: {'disable_account': queryBody.status, 'dissable_account_timestamp' : timestamp } });
    res.send({
        success : true
    })
}
