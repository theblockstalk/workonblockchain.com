const User = require('../../../../../model/users');
const errors = require('../../../../services/errors');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    const userDoc = await User.findOne({ _id: userId }).lean();

    if(userDoc){
        const queryBody = req.body;
        let userUpdate = {};
        if (queryBody.saved_searches && queryBody.saved_searches.length > 0) userUpdate["company.saved_searches"] = queryBody.saved_searches;

        await User.update({ _id: userId },{ $set: userUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwError("User not found", 404);
    }

}