const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const Pages = require('../../../../../model/pages_content');
const errors = require('../../../../services/errors');

///// for save candidate "terms & condition(sign-up)" data in db//////////////////

module.exports = async function (req,res) {

	let userId = req.auth.user._id;
	let candidateDoc = await CandidateProfile.findOne({ _creator: userId }).lean();
	if(candidateDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}

        if(queryBody.termsID)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.termsID}).lean();
            if(pagesDoc) {
                if(pagesDoc._id) candidateUpdate.terms_id = pagesDoc._id;
                if(queryBody.marketing) candidateUpdate.marketing_emails = queryBody.marketing;
                await CandidateProfile.update({ _creator: userId },{ $set: candidateUpdate });
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
                await CandidateProfile.update({ _creator: userId },{ $set: candidateUpdate });
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
