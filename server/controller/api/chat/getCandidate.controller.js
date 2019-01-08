const users = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');

const filterReturnData = require('../users/filterReturnData');

module.exports = async function (req, res) {
    let sender_id,receiver_id,is_company_reply,user_type;
    if (req.body.sender_id === '0') { // company is calling endpoint
        sender_id = req.auth.user._id;
        receiver_id = req.body.receiver_id;
        is_company_reply = req.body.is_company_reply;
        user_type = req.body.type;
    }
    else if (req.body.receiver_id === '0') { // candidate is calling endpoint
        sender_id = req.body.sender_id;
        receiver_id = req.auth.user._id;
        is_company_reply = req.body.is_company_reply;
        user_type = req.body.type;
    }
    else { // admin is calling endpoint
        if (req.auth.user.is_admin){
            sender_id = req.body.sender_id;
            receiver_id = req.body.receiver_id;
            is_company_reply = req.body.is_company_reply;
            user_type = req.body.type;
        }
    }
    if(req.body.type === 'candidate') {
        const userDoc = await users.findOne({
            $and: [{ _id : receiver_id }, { type : user_type }]
        }).lean();
        if(userDoc){
            const candidateProfile = await CandidateProfile.findOne({
                "_creator": userDoc._id
            }).populate('_creator').lean();
            if (candidateProfile)
            {
                let query_result = filterReturnData.removeSensativeData(candidateProfile);
                if(is_company_reply === 1){
                }
                else{
                    query_result = filterReturnData.anonymousSearchCandidateData(query_result);
                }
                res.send({
                    users:query_result
                });
            }
            else
            {
                errors.throwError('User not found', 404);
            }
        }
        else{
            errors.throwError('User not found', 404);
		}
    }
    else{
        const userDoc = await users.findOne({
            $and: [{ _id : sender_id }, { type : user_type }]
        }).lean();
        if(userDoc) {
            const companyProfile = await EmployerProfile.findOne({
                "_creator": userDoc._id
            }).populate('_creator').lean();
            if (companyProfile)
            {
                let query_result = filterReturnData.removeSensativeData(companyProfile);
                query_result = filterReturnData.anonymousCandidateData(query_result);
                res.send({
                    users:query_result
                });
            }
            else
            {
                errors.throwError('User not found', 404);
            }
        }
        else{
            errors.throwError('User not found', 404);
        }
	}
};