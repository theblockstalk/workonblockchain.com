const User = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const filterReturnData = require('../../filterReturnData');
const errors = require('../../../../services/errors');

module.exports = async function (req,res) {

    let userId = req.auth.user._id;

    const userDoc = await User.find({type : 'candidate' , is_verify :1, is_approved :1 , disable_account : false }).lean();
    let userIds = [];
    for (detail of userDoc) {
        const ids =  await getUsersIds(detail);
        userIds.push(ids);
    }
    const candidateDoc = await CandidateProfile.find({_creator : {$in : userIds }}).populate('_creator').lean();
    if(candidateDoc) {
        if(candidateDoc.length <= 0) {
            errors.throwError("No candidates matched this search criteria", 404);
        }
        else
        {
            let filterArray = [];
            for(candidateDetail of candidateDoc) {
                const filterDataRes = await filterData(candidateDetail , userId);
                filterArray.push(filterDataRes);
            }

            res.send(filterArray);

        }

    }

}

let getUsersIds = async function getUsersIds(detail) {
    return detail._id ;
}

let filterData = async function filterData(candidateDetail , userId) {
    return filterReturnData.candidateAsCompany(candidateDetail,userId);
}
