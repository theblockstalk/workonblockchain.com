const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../model/mongoose/users');
const candidate = require('../../../model/mongoose/candidate');
const messages = require('../../../model/mongoose/messages');
const filterReturnData = require('../../../controller/api/users/filterReturnData');
const company = require('../../../model/mongoose/company');
const errors = require('../../services/errors');

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
    await auth.isValidUser(req);

    if (req.query.admin) {
        await auth.isAdmin(req);
    }
}

module.exports.endpoint = async function (req, res) {
    let userId, userDoc;

    if (req.query.admin) {
        userId = req.query.user_id;
    }
    else {
        userId = req.auth.user._id;
    }

    userDoc = await users.findOneById(userId);
    let conversations = [];
    if(userDoc.conversations) {
        conversations = userDoc.conversations;

        if (conversations && conversations.length > 0) {
            conversations.sort(function (a, b) {
                return a.last_message < b.last_message;
            });

            for (i = 0; i < conversations.length; i++) {
                const conversationUser = await
                users.findOneById(conversations[i].user_id);
                //conversations[i].push({name: 'Remote' , visa_needed : false});
                conversations[i].name = '';
                conversations[i].image = '';
                if (conversationUser.type === 'candidate') {
                    if (req.query.admin) {
                        conversations[i].name = conversationUser.first_name + ' ' + conversationUser.last_name;
                    }
                    else {
                        if (conversations[i]) {
                            const acceptedJobOffer = await
                            messages.findOne({
                                sender_id: conversations[i].user_id,
                                receiver_id: userId,
                                msg_tag: 'job_offer_accepted'
                            });
                            if (acceptedJobOffer) {
                                conversations[i].name = conversationUser.first_name + ' ' + conversationUser.last_name;
                            }
                            else {
                                conversations[i].name = filterReturnData.createInitials(conversationUser.first_name, conversationUser.last_name);
                            }
                            conversations[i].image = conversationUser.image;
                        }
                    }
                }
                else {
                    if (conversations[i]) {
                        const companyProfile = await
                        company.findOne({
                            "_creator": conversations[i].user_id
                        });
                        conversations[i].name = companyProfile.company_name;
                        conversations[i].image = companyProfile.company_logo;
                    }
                }
            }
        }
    }

    if(conversations.length>0) {
        res.send({
            conversations: conversations
        });
    }
    else{
        errors.throwError('Conversation not found', 400);
    }
}