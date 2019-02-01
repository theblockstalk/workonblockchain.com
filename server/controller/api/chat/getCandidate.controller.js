const users = require('../../../model/mongoose/users');
const EmployerProfile = require('../../../model/employer_profile');
const filterReturnData = require('../users/filterReturnData');
const errors = require('../../services/errors');

module.exports = async function (req, res) {
    let sender_id,receiver_id,msg_tag,user_type;
    let is_admin = 0;
    if (req.body.sender_id === '0') { // company is calling endpoint
        sender_id = req.auth.user._id;
        receiver_id = req.body.receiver_id;
        msg_tag = req.body.msg_tag;
        user_type = req.body.type;
    }
    else if (req.body.receiver_id === '0') { // candidate is calling endpoint
        sender_id = req.body.sender_id;
        receiver_id = req.auth.user._id;
        msg_tag = req.body.msg_tag;
        user_type = req.body.type;
    }
    else { // admin is calling endpoint
        if (req.auth.user.is_admin){
            console.log('admin is calling');
            is_admin = 1;
            sender_id = req.body.sender_id;
            receiver_id = req.body.receiver_id;
            msg_tag = req.body.msg_tag;
            user_type = req.body.type;
        }
    }
    if(req.body.type === 'candidate') {
        console.log('getting cand data');
        console.log('is_admin: ' + is_admin);
        const userDoc = await users.findOne({
            $and: [{ _id : receiver_id }, { type : user_type }]
        });
        if(userDoc){
            let candidateObject= {}  //// remove this after chat refactor
            //let query_result = filterReturnData.removeSensativeData(userDoc); //// uncomment this after chat refactor
            if(is_company_reply === 1){
                candidateObject = {
                    '_creator' : {
                        _id : userDoc._id,
                        email : userDoc.email,
                        type : userDoc.type,
                    },
                    'first_name' : userDoc.first_name,
                    'last_name' : userDoc.last_name
                }
            }
            else{
                candidateObject = {
                    '_creator'  : {
                        _id : userDoc._id,
                        email : userDoc.email,
                        type : userDoc.type,
                    },
                    'initials' : filterReturnData.createInitials(userDoc.first_name,userDoc.last_name)

                }
                //query_result = filterReturnData.anonymousSearchCandidateData(query_result); //// uncomment this after chat refactor
            }
            res.send({
                users:candidateObject
            });
        }
        else{
            errors.throwError('User not found', 404);
        }
    }
    else{
        console.log('getting comp data');
        console.log('is_admin: ' + is_admin);
        const userDoc = await users.findOne({
            $and: [{ _id : sender_id }, { type : user_type }]
        });
        if(userDoc) {
            const companyProfile = await EmployerProfile.findOne({
                "_creator": userDoc._id
            }).populate('_creator').lean();
            if (companyProfile)
            {
                //let query_result = filterReturnData.removeSensativeData(companyProfile);
                //query_result = filterReturnData.anonymousCandidateData(query_result);
                res.send({
                    users:companyProfile
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