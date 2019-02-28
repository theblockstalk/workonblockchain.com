const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../model/mongoose/users');
const messages = require('../../../model/mongoose/messages');
const filterReturnData = require('../../../controller/api/users/filterReturnData');
const company = require('../../../model/mongoose/company');
const errors = require('../../services/errors');
const logger = require('../../services/logger');

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
    conversations = userDoc.conversations;
    if (conversations && conversations.length > 0) {
        conversations.sort(function (a, b) {
            return a.last_message < b.last_message;
        });
        logger.debug('converstaions', {conversations:conversations,'userID':userDoc._id});
        logger.debug("length", {length: conversations.length});
        for (let i = 0; i < conversations.length; i++) {
            logger.debug('i', {i: i})
            const conversationUser = await users.findOneById(conversations[i].user_id);
            if (conversationUser.type === 'candidate') {
                if (req.query.admin) {
                    conversations[i].name = conversationUser.first_name + ' ' + conversationUser.last_name;
                }
                else {
                    const acceptedJobOffer = await messages.findOne({
                        sender_id: conversations[i].user_id,
                        receiver_id: userId,
                        msg_tag: 'job_offer_accepted'
                    });
                    if (acceptedJobOffer) {
                        logger.debug('about to set name1', {i: i})
                        conversations[i].name = conversationUser.first_name + ' ' + conversationUser.last_name;
                    }
                    else {
                        logger.debug('about to set name2', {i: i})
                        conversations[i].name = filterReturnData.createInitials(conversationUser.first_name, conversationUser.last_name);
                    }
                    conversations[i].image = conversationUser.image;
                }
            }
            else {
                const companyProfile = await
                company.findOne({
                    "_creator": conversations[i].user_id
                });
                logger.debug('about to set name3', {i: i})
                conversations[i].name = companyProfile.company_name;
                conversations[i].image = companyProfile.company_logo;
            }
        }
    }

    if(conversations && conversations.length>0) {
        res.send({
            conversations: conversations
        });
    }
    else{
        errors.throwError('Conversation not found', 400);
    }
}