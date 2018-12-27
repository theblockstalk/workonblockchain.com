const User = require('../../../../../model/users');
const errors = require('../../../../services/errors');

module.exports = async function (req,res) {
	let userId = req.auth.user._id;
    const candidateUserDoc = await User.findOne({ _id: userId}).lean();

    if(candidateUserDoc) {
        const queryBody = req.body;
        let candidateUpdate = {}
        if (queryBody.language_exp) candidateUpdate['candidate.programming_languages'] = queryBody.language_exp;
        if (queryBody.education) candidateUpdate['candidate.education_history'] = queryBody.education;
        if (queryBody.work) candidateUpdate['candidate.work_history'] = queryBody.work;
        if (queryBody.detail.intro) candidateUpdate['candidate.description'] = queryBody.detail.intro;

        await User.update({ _id: userId },
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
        res.send({
            success : true
        })

    }
    else {
        errors.throwError("Candidate account not found", 404);
    }

}

