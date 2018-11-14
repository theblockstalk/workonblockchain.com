const EmployerProfile = require('../../../../../model/employer_profile');
const Pages = require('../../../../../model/pages_content');
const errors = require('../../../../services/errors');

///////////add company summary or Terms& conditions in db////////////////////////////

module.exports = async   function (req,res)
{
    let userId = req.auth.user._id;
    const employerDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

    if(employerDoc) {
        const queryBody = req.body;
        let employerUpdate = {};

        if(queryBody.termsID)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.termsID}).lean();
            if(pagesDoc) {
                if(pagesDoc._id) employerUpdate.terms_id = pagesDoc._id;
                if(queryBody.marketing) employerUpdate.marketing_emails = queryBody.marketing;
                await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });
                res.send({
                    success : true
                })
            }
            else
            {
                errors.throwErrors("Terms and Conditions document not found", 400);
            }
        }
        else {
            if(queryBody.marketing) {
                employerUpdate.marketing_emails = queryBody.marketing;
                await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });
            }

            res.send({
                success : true
            })
        }

    }
    else {
        errors.throwError("Company account not found", 400)

    }
}