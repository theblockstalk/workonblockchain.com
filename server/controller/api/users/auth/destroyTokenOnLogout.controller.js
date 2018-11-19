const User = require('../../../../model/users');

module.exports = async function (req,res) {
	let userId = req.auth.user._id;
    const token = null;
    await User.update({ _id: userId},{ $set: {'jwt_token': token} });
    res.send({
        success :true
    })

}
