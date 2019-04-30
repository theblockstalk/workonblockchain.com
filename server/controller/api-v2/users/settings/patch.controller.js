const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;

const users = require('../../../../model/mongoose/users');
const companies = require('../../../../model/mongoose/company');
const Pages = require('../../../../model/mongoose/pages');
const errors = require('../../../services/errors');
const mongoose = require('mongoose');


module.exports.request = {
    type: 'patch',
    path: '/users/settings'
};

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

    if(queryBody.marketing_emails ||  queryBody.marketing_emails === false) {
        updateCandidateUser['marketing_emails'] = queryBody.marketing_emails;
    }

    if(queryBody.disable_account || queryBody.disable_account === false) {
        updateCandidateUser['disable_account'] = queryBody.disable_account;
        updateCandidateUser['dissable_account_timestamp'] = timestamp;
    }


    if(queryBody.is_unread_msgs_to_send || queryBody.is_unread_msgs_to_send === false) updateCandidateUser['is_unread_msgs_to_send'] = queryBody.is_unread_msgs_to_send;

    if(queryBody.terms_id) {

        if (userDoc.type === 'candidate') {
            let latest_terms = await Pages.findOneAndSort({page_name: 'Terms and Condition for candidate'});
            if (queryBody.terms_id === latest_terms._id.toString()) {
                updateCandidateUser['candidate.terms_id'] = queryBody.terms_id;
            }
        }
        else {
            console.log(queryBody)
            let latest_terms = await Pages.findOne({page_name: 'Terms and Condition for company'});
            if (queryBody.terms_id === latest_terms._id.toString()) {
                await companies.update({ _creator: userId },{ $set: {'terms_id' : queryBody.terms_id} });
            }
        }
    }
    await users.update({ _id: userId },{ $set: updateCandidateUser });
    res.send({
        success : true
    })
}