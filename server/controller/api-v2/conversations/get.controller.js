const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../model/mongoose/users');
const candidate = require('../../../model/mongoose/candidate');
const messages = require('../../../model/mongoose/messages');
const filterReturnData = require('../../../controller/api/users/filterReturnData');
const company = require('../../../model/mongoose/company');

module.exports.request = {
    type: 'get',
    path: '/conversations/'
};

const querySchema = new Schema({
    user_id: String,
    admin: Boolean
});

module.exports.inputValidation = {
    query: querySchema
};

module.exports.auth = async function (req) {
    console.log('in auth');
    await auth.isValidUser(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    console.log('in endpoint');
    let userId, userDoc;

    if(req.query.admin){
        userId = req.query.user_id;
    }
    else{
        userId = req.auth.user._id;
    }

    userDoc = await users.findOneById(userId);
    let conversations = userDoc.conversations;
    conversations.sort(function(a, b){
        return a.last_message < b.last_message;
    });

    for(i=0;i<conversations.length;i++){
        console.log(conversations[i].last_message);
        if(req.auth.user.type === 'company') {
            console.log("user_id: " + conversations[i].user_id);
            const candidateProfile = await
            candidate.findOne({
                "_creator": conversations[i].user_id
            });
            let query_result = filterReturnData.removeSensativeData(candidateProfile);
            const acceptedJobOffer = await
            messages.findOne({
                sender_id: conversations[i].user_id,
                receiver_id: userId,
                msg_tag: 'job_offer_accepted'
            });
            if (acceptedJobOffer && acceptedJobOffer.length > 0) {
                conversations[i].first_name = query_result.first_name;
                conversations[i].last_name = query_result.last_name;
            }
            else {
                query_result = filterReturnData.anonymousSearchCandidateData(query_result);
                conversations[i].initials = query_result.initials;
            }
            conversations[i].image = query_result.image;
        }
        else{
            const companyProfile = await company.findOne({
                "_creator": conversations[i].user_id
            });
            conversations[i].company_name = companyProfile.company_name;
            conversations[i].company_logo = companyProfile.company_logo;
        }
    }

    console.log(conversations);
    console.log('in get');

    res.send({
        conversations: conversations
    });
}