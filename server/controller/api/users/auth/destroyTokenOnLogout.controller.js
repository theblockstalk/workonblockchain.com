const users = require('../../../../model/mongoose/users');

module.exports = async function (req,res) {
	let userId = req.auth.user._id;
    await users.update({ _id: userId},{ $unset: {'jwt_token': 1} });
    res.send({
        success :true
    })

}
