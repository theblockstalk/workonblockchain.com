const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;

const users = require('../../../model/mongoose/users');
const companies = require('../../../model/mongoose/company');
const Pages = require('../../../model/pages_content');
const errors = require('../../services/errors');


module.exports.request = {
    type: 'patch',
    path: '/users/:user_id'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    marketing_emails: {
        type: Boolean,
    },
    terms_id: Schema.Types.ObjectId,
    disable_account : {
        type:Boolean,
    },
    is_unread_msgs_to_send: {
        type:Boolean,
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};


module.exports.auth = async function (req) {
    await auth.isValidUser(req);
}


module.exports.endpoint = async function (req, res) {
    const userDoc = req.auth.user;
    const userId = req.auth.user._id;

    let queryBody = req.body;
    let updateCandidateUser = {};
    const timestamp = new Date();
    let terms_page_doc_id;

    if(queryBody.marketing_emails === true) updateCandidateUser['marketing_emails'] = queryBody.marketing_emails;
    if(queryBody.marketing_emails === false) updateCandidateUser['marketing_emails'] = false;

    if(queryBody.disable_account === true) {
        updateCandidateUser['disable_account'] = queryBody.disable_account;
        updateCandidateUser['dissable_account_timestamp'] = timestamp;
    }
    if(queryBody.disable_account === false) {
        updateCandidateUser['disable_account'] = false;
        updateCandidateUser['dissable_account_timestamp'] = timestamp;
    }

    if(queryBody.is_unread_msgs_to_send === true) updateCandidateUser['is_unread_msgs_to_send'] = queryBody.is_unread_msgs_to_send;
    if(queryBody.is_unread_msgs_to_send === false)  updateCandidateUser['is_unread_msgs_to_send'] = false;

    if(queryBody.terms_id) {
        const pagesDoc =  await Pages.findOne({_id: queryBody.terms_id}).lean();
        if(pagesDoc) {
            if(pagesDoc._id) terms_page_doc_id = pagesDoc._id;
        }
        else
        {
            errors.throwError("Terms and Conditions document not found", 404);
        }
        if(userDoc.type === 'candidate'){
            updateCandidateUser['candidate.terms_id'] = terms_page_doc_id;
        }

        if(userDoc.type === 'company') {
            await companies.update({ _creator: userId },{ $set: {'terms_id' : terms_page_doc_id} });
        }
    }
    await users.update({ _id: userId },{ $set: updateCandidateUser });
    res.send({
        success : true
    })
}