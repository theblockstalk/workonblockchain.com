const User = require('../../../../../model/users');
const Pages = require('../../../../../model/pages_content');
const errors = require('../../../../services/errors');

///// for save candidate "terms & condition(sign-up)" data in db//////////////////

module.exports = async function (req,res) {

	let userId = req.auth.user._id;
	let candidateUserDoc = await User.findOne({ _id: userId }).lean();
	if(candidateUserDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if(queryBody.termsID)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.termsID}).lean();
            if(pagesDoc) {
                if(pagesDoc._id) candidateUpdate['candidate.terms_id'] = pagesDoc._id;
                if(queryBody.marketing) candidateUpdate.marketing_emails = queryBody.marketing;
                await User.update({ _id: userId },{ $set: candidateUpdate });
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
                candidateUpdate.marketing_emails = queryBody.marketing;
                await User.update({ _id: userId },{ $set: candidateUpdate });
            }

            res.send({
                success : true
            })

		}
	}
	else {
        errors.throwError("Candidate account not found", 404);
    }

}
