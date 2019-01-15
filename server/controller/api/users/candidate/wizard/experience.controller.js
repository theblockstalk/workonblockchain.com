const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');

module.exports = async function (req,res) {
	let userId = req.auth.user._id;
    const candidateUserDoc = await users.findOneById(userId);

    if(candidateUserDoc) {
        const queryBody = req.body;
        let candidateUpdate = {};
        let unset = {};
        if (queryBody.language_exp && queryBody.language_exp.length > 0) candidateUpdate['candidate.programming_languages'] = queryBody.language_exp;
        else unset['candidate.programming_languages'] = 1;

        if (queryBody.education && queryBody.education.length > 0) candidateUpdate['candidate.education_history'] = queryBody.education;
        else unset['candidate.education_history'] = 1;

        if (queryBody.work && queryBody.work.length > 0) candidateUpdate['candidate.work_history'] = queryBody.work;
        else unset['candidate.work_history'] = 1;

        if (queryBody.detail.intro) candidateUpdate['candidate.description'] = queryBody.detail.intro;

        await users.update({ _id: userId },
            {
                $push: {
                    'candidate.status' : {
                        $each: [{ status: 'wizard completed',
                        status_updated: new Date(),
                        timestamp: new Date()}],
                        $position: 0
                    }
                },
                $set: candidateUpdate
            }
        );

        if (!filterReturnData.isEmptyObject(unset)) {
            await users.update({ _id: userId},{$unset: unset});
        }
        res.send({
            success : true
        })

    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}

