const auth = require('../../middleware/auth-v2');
const users = require('../../../model/mongoose/users');

module.exports.request = {
    type: 'patch',
    path: '/users/'
};

module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}

module.exports.endpoint = async function (req, res) {
    let userId = req.auth.user._id;
    await users.update({ _id: userId},{ $set: {'viewed_explanation_popup': true} });
    res.send({
        success : true
    });
}