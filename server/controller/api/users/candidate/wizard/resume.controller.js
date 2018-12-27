const User = require('../../../../../model/users');
const errors = require('../../../../services/errors');

///// for candidate resume(blockchain) wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateUserDoc = await User.findOne({ _id: myUserDoc._id }).lean();

    if(candidateUserDoc) {
        const userParam = req.body;

        let candidateUpdate = {}
        if (userParam.why_work) candidateUpdate['candidate.why_work'] = userParam.why_work;
        if (userParam.commercial_experience_year) candidateUpdate['candidate.blockchain.commercial_platforms'] = userParam.commercial_experience_year;
        if (userParam.experimented_platform) candidateUpdate['candidate.blockchain.experimented_platforms'] = userParam.experimented_platform;
        if (userParam.platforms) candidateUpdate['candidate.blockchain.smart_contract_platforms'] = userParam.platforms;
        if(userParam.commercial_skills) candidateUpdate['candidate.blockchain.commercial_skills'] = userParam.commercial_skills;
        if(userParam.formal_skills) candidateUpdate['candidate.blockchain.formal_skills'] = userParam.formal_skills;

        await User.update({ _id: myUserDoc._id },{ $set: candidateUpdate });

        res.send({
            success: true
        });
    }

    else {
        errors.throwError("Candidate account not found", 404);
    }

};
