const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const multer = require('../../../controller/middleware/multer');
const Pages = require('../../../model/mongoose/pages');
const companies = require('../../../model/mongoose/company');
const errors = require('../../services/errors');
const filterReturnData = require('../../api/users/filterReturnData');
const users = require('../../../model/mongoose/users');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    marketing_emails: {
        type: Boolean
    },
    privacy_id: {
        type : String
    },
    terms_id: {
        type : String
    },
    disable_account: {
        type: Boolean
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}


module.exports.endpoint = async function (req, res) {
    let userId = req.auth.user._id;
    const queryBody = req.body;
    if(req.auth.user.type === 'company'){
        const employerDoc = await companies.findOne({ _creator: userId });
        let employerUpdate = {};

        if(employerDoc){
            if(queryBody.privacy_id) {
                const pagesDoc =  await Pages.findByDescDate({page_name: 'Privacy Notice'});
                if(pagesDoc._id.toString() === queryBody.privacy_id) employerUpdate.privacy_id = pagesDoc._id;
                else errors.throwError("Privacy notice document not found", 404);
            }

            if(queryBody.terms_id) {
                const pagesDoc =  await Pages.findByDescDate({page_name: 'Terms and Condition for company'});
                if(pagesDoc._id.toString() === queryBody.terms_id) employerUpdate.terms_id = pagesDoc._id;
                else errors.throwError("Terms and Condition document for company not found", 404);
            }
            if(queryBody.marketing_emails || queryBody.marketing_emails === false) employerUpdate.marketing_emails = queryBody.marketing_emails;
            if(queryBody.disable_account || queryBody.disable_account === false) {
                await users.update({_id: userId}, {
                    $set : {
                        disable_account: queryBody.disable_account
                    }
                });
            }

            await companies.update({ _id: employerDoc._id },{ $set: employerUpdate});

            res.send();
        }
        else {
            errors.throwError("Company account not found", 404);
        }
    }
    else if(req.auth.user.type === 'candidate'){
        let updateCandidateUser = {};
        let userDoc = req.auth.user;
        if(queryBody.privacy_id) {
            const pagesDoc =  await Pages.findByDescDate({page_name: 'Privacy Notice'});
            if(pagesDoc._id.toString() === queryBody.privacy_id) updateCandidateUser['candidate.privacy_id'] = pagesDoc._id;
            else errors.throwError("Privacy notice document not found", 404);
        }

        if(queryBody.terms_id) {
            const pagesDoc =  await Pages.findByDescDate({page_name: 'Terms and Condition for candidate'});
            if(pagesDoc._id.toString() === queryBody.terms_id) updateCandidateUser['candidate.terms_id'] = pagesDoc._id;
            else errors.throwError("Terms and Condition document for candidate not found", 404);
        }
        if(queryBody.marketing_emails || queryBody.marketing_emails === false) updateCandidateUser.marketing_emails = queryBody.marketing_emails;
        if(queryBody.disable_account || queryBody.disable_account === false) updateCandidateUser.disable_account = queryBody.disable_account;

        await users.update({_id: userId}, {
            $set : updateCandidateUser
        });

        res.send();
    }
}