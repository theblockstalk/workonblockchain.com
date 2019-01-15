const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');

///// for candidate resume(blockchain) wizard ///////////////////

module.exports = async function (req, res) {

    const myUserDoc = req.auth.user;

    const candidateUserDoc = await users.findOneById(myUserDoc._id );

    if(candidateUserDoc) {
        const userParam = req.body;
        let candidateUpdate = {};
        let unset = {};
        if (userParam.why_work) candidateUpdate['candidate.why_work'] = userParam.why_work;
        if (userParam.commercial_platforms && userParam.commercial_platforms.length > 0 ) candidateUpdate['candidate.blockchain.commercial_platforms'] = userParam.commercial_platforms;
        else unset['candidate.blockchain.commercial_platforms'] = 1;

        if (userParam.experimented_platforms && userParam.experimented_platforms.length > 0) candidateUpdate['candidate.blockchain.experimented_platforms'] = userParam.experimented_platforms;
        else unset['candidate.blockchain.experimented_platforms'] = 1;

        if (userParam.smart_contract_platforms && userParam.smart_contract_platforms.length > 0) candidateUpdate['candidate.blockchain.smart_contract_platforms'] = userParam.smart_contract_platforms;
        else unset['candidate.blockchain.smart_contract_platforms'] = 1;

        if(userParam.commercial_skills && userParam.commercial_skills.length > 0) candidateUpdate['candidate.blockchain.commercial_skills'] = userParam.commercial_skills;
        else unset['candidate.blockchain.commercial_skills'] = 1;

        if(userParam.formal_skills && userParam.formal_skills.length > 0) candidateUpdate['candidate.blockchain.formal_skills'] = userParam.formal_skills;
        else unset['candidate.blockchain.formal_skills'] = 1;

        let updateObj;
        if (!filterReturnData.isEmptyObject(candidateUpdate) && !filterReturnData.isEmptyObject(unset)) {
            updateObj = {$set: candidateUpdate, $unset: unset}
        } else if (!filterReturnData.isEmptyObject(candidateUpdate)) {
            updateObj = {$set: candidateUpdate};
        } else if (!filterReturnData.isEmptyObject(unset)) {
            updateObj = {$unset: unset};
        }

        await users.update({ _id: myUserDoc._id },updateObj);

        res.send({
            success: true
        });
    }

    else {
        errors.throwError("Candidate account not found", 404);
    }

};
