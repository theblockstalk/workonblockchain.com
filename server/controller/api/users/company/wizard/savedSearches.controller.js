const companies = require('../../../../../model/mongoose/company');

const errors = require('../../../../services/errors');

module.exports = async function (req,res)
{
    let userId = req.auth.user._id;
    const companyDoc = await companies.findOne({ _creator: userId });

    if(companyDoc){
        const queryBody = req.body;
        console.log(queryBody.saved_searches);
        const email_notification = queryBody.saved_searches[0].when_receive_email_notitfications;
        let companyUpdate = {};
        if (queryBody.saved_searches && queryBody.saved_searches.length > 0) companyUpdate.saved_searches = queryBody.saved_searches;
        if(email_notification) companyUpdate.when_receive_email_notitfications = email_notification;
        console.log(companyUpdate);
        await companies.update({ _creator: userId },{ $set: companyUpdate });

        res.send({
            success : true
        })
    }

    else {
        errors.throwError("Company doc not found", 404);
    }

}