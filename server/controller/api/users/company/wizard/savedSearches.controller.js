const EmployerProfile = require('../../../../../model/employer_profile');
const errors = require('../../../../services/errors');

module.exports = async  function (req,res)
{
    let userId = req.auth.user._id;
    const companyDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

    if(companyDoc){
        const queryBody = req.body;
        let companyUpdate = {};
        if (queryBody.saved_searches && queryBody.saved_searches.length > 0) companyUpdate.saved_searches = queryBody.saved_searches;

        await EmployerProfile.update({ _creator: userId },{ $set: companyUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwError("Company doc not found", 404);
    }

}