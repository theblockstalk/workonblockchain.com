const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const pages = require('../../../model/mongoose/pages');
const companies = require('../../../model/mongoose/company');
const errors = require('../../services/errors');
const users = require('../../../model/mongoose/users');
const objects = require('../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/users/'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    privacy_id: {
        type : String
    },
    terms_id: {
        type : String
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    if(!objects.isEmpty(req.body)) await auth.isLoggedIn(req);
    else await auth.isValidUser(req);
}

module.exports.endpoint = async function (req, res) {
    let userId = req.auth.user._id;
    if(!objects.isEmpty(req.body)) {
        const queryBody = req.body;
        if (req.auth.user.type === 'company') {
            const employerDoc = await companies.findOne({_creator: userId});
            let employerUpdate = {};

            if (employerDoc) {
                if (queryBody.privacy_id) {
                    const pagesDoc = await pages.findByDescDate({page_name: 'Privacy Notice'});
                    if (pagesDoc._id.toString() === queryBody.privacy_id) employerUpdate.privacy_id = pagesDoc._id;
                    else errors.throwError("Privacy notice document not found", 404);
                }

                if (queryBody.terms_id) {
                    const pagesDoc = await pages.findByDescDate({page_name: 'Terms and Condition for company'});
                    if (pagesDoc._id.toString() === queryBody.terms_id) employerUpdate.terms_id = pagesDoc._id;
                    else errors.throwError("Terms and Condition document for company not found", 404);
                }

                await companies.update({_id: employerDoc._id}, {$set: employerUpdate});

                res.send();
            }
            else {
                errors.throwError("Company account not found", 404);
            }
        }
        else if (req.auth.user.type === 'candidate') {
            let updateCandidateUser = {};
            let userDoc = req.auth.user;
            if (queryBody.privacy_id) {
                const pagesDoc = await pages.findByDescDate({page_name: 'Privacy Notice'});
                if (pagesDoc._id.toString() === queryBody.privacy_id) updateCandidateUser['candidate.privacy_id'] = pagesDoc._id;
                else errors.throwError("Privacy notice document not found", 404);
            }

            if (queryBody.terms_id) {
                const pagesDoc = await pages.findByDescDate({page_name: 'Terms and Condition for candidate'});
                if (pagesDoc._id.toString() === queryBody.terms_id) updateCandidateUser['candidate.terms_id'] = pagesDoc._id;
                else errors.throwError("Terms and Condition document for candidate not found", 404);
            }
            await users.update({_id: userId}, {
                $set: updateCandidateUser
            });

            res.send();
        }
    }
    else {
        await users.update({ _id: userId},{ $set: {'viewed_explanation_popup': true} });
        res.send({
            success : true
        });
    }
};