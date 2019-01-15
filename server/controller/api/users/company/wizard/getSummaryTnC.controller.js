const companies = require('../../../../../model/mongoose/company');
const Pages = require('../../../../../model/pages_content');
const errors = require('../../../../services/errors');

///////////add company summary or Terms& conditions in db////////////////////////////

module.exports = async   function (req,res)
{
    let userId = req.auth.user._id;
    const employerDoc = await companies.findOne({ _creator: userId });

    if(employerDoc) {
        const queryBody = req.body;
        let employerUpdate = {};

        if(queryBody.termsID)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.termsID}).lean();
            if(pagesDoc) {
                if(pagesDoc._id) employerUpdate.terms_id = pagesDoc._id;
                if(queryBody.marketing) employerUpdate.marketing_emails = queryBody.marketing;
                await companies.update({ _creator: userId },{ $set: employerUpdate });
                res.send({
                    success : true
                })
            }
            else
            {
                errors.throwError("Terms and Conditions document not found", 404);
            }
        }
        else {
            if(queryBody.marketing) {
                employerUpdate.marketing_emails = queryBody.marketing;
                await companies.update({ _creator: userId },{ $set: employerUpdate });
            }

            res.send({
                success : true
            })
        }

    }
    else {
        errors.throwError("Company account not found", 404)

    }
}