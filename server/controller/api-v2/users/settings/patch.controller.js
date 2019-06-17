const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;

const users = require('../../../../model/mongoose/users');
const companies = require('../../../../model/mongoose/company');
const Pages = require('../../../../model/mongoose/pages');
const errors = require('../../../services/errors');
const mongoose = require('mongoose');
const objects = require('../../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/users/settings'
};

const bodySchema = new Schema({
    marketing_emails: {
        type: Boolean,
    },
    terms_id: String,
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
    await auth.isLoggedIn(req);
}


module.exports.endpoint = async function (req, res) {
    const userDoc = req.auth.user;
    const userId = req.auth.user._id;

    let queryBody = req.body;
    let updateUser = {};
    let updateCompany = {};
    const timestamp = new Date();

    if(queryBody.marketing_emails ||  queryBody.marketing_emails === false) {
        if (userDoc.type === 'candidate') updateUser['marketing_emails'] = queryBody.marketing_emails;
        else updateCompany['marketing_emails'] = queryBody.marketing_emails;
    }

    if(queryBody.disable_account || queryBody.disable_account === false) {
        updateUser['disable_account'] = queryBody.disable_account;
        updateUser['dissable_account_timestamp'] = timestamp;
    }


    if(queryBody.is_unread_msgs_to_send || queryBody.is_unread_msgs_to_send === false) updateUser['is_unread_msgs_to_send'] = queryBody.is_unread_msgs_to_send;

    if(queryBody.terms_id) {
        console.log('in terms id: '+ queryBody.terms_id);
        if (userDoc.type === 'candidate') {
            let latest_terms = await Pages.findOneAndSort({page_name: 'Terms and Condition for candidate'});
            if (queryBody.terms_id === latest_terms._id.toString()) {
                updateUser['candidate.terms_id'] = queryBody.terms_id;
            }
        }
        else {
            let latest_terms = await Pages.findOneAndSort({page_name: 'Terms and Condition for company'});
            if (queryBody.terms_id === latest_terms._id.toString()) {
                updateCompany['terms_id'] = queryBody.terms_id;
            }
        }
    }
    if(!objects.isEmpty(updateUser)) {
        await users.update({ _id: userId },{ $set: updateUser });
    }
    if(!objects.isEmpty(updateCompany)) {
        await companies.update({ _creator: userId },{ $set: updateCompany });
    }

    res.send({
        success : true
    })
}