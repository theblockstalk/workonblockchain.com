var Q = require('q');
const User = require('../../../model/users');

module.exports = async function (req,res){
    let userId = req.auth.user._id;
    let queryBody = req.body;
    await User.update({ _id: userId},{ $set: {'viewed_explanation_popup': queryBody.status} });
    res.send({
        success : true
    })
}