const EmployerProfile = require('../../../../../model/employer_profile');
const Pages = require('../../../../../model/pages_content');

///////////add company summary or Terms& conditions in db////////////////////////////

module.exports = async   function (req,res)
{
	let userId = req.auth.user._id;
	const employerDoc = await EmployerProfile.findOne({ _creator: userId }).lean();

	if(employerDoc) {
		const companyParam = req.body;
        let employerUpdate = {};

        if(companyParam.termsID)
        {
        	const pagesDoc =  await Pages.findOne({_id: companyParam.termsID}).lean();
        	if(pagesDoc) {
        		if(pagesDoc._id) employerUpdate.terms_id = pagesDoc._id;
        		if(companyParam.marketing) employerUpdate.marketing_emails = companyParam.marketing;
                await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });
                res.send({
                    success : true
                })
            }
			else
			{
				res.send({
					error : 'Not a valid doc'
				})
			}
        }
        else {
            if(companyParam.marketing) employerUpdate.marketing_emails = companyParam.marketing;
            await EmployerProfile.update({ _creator: userId },{ $set: employerUpdate });
            res.send({
                success : true
            })
		}

    }
	else {
		res.sendStatus(404);
	}
}