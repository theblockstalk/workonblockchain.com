const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../../../../../server/controller/api/users/filterReturnData');
const enumerations = require('../../../../../model/enumerations');
const candidateSearch = require('../../../../../../server/controller/api/users/candidate/searchCandidates');

module.exports.request = {
    type: 'post',
    path: '/users/candidates/search'
};

const bodySchema = new Schema({
    status: {
        type: String,
        enum: enumerations.candidateStatus
    },

    disable_account: {
        type:Boolean
    },
    is_verify: {
        type:Boolean
    },
    msg_tags: {
        type: [{
            type: String,
            enum: enumerations.chatMsgTypes
        }]
    },
    search_word: {
        type:String
    }
});

const querySchema = new Schema({
    is_admin: Boolean
});

module.exports.inputValidation = {
    body: bodySchema,
    query: querySchema
}

module.exports.auth = async function (req) {
    if(req.query.is_admin === 'true' || req.query.is_admin === true) await auth.isAdmin(req);
    else await auth.isValidCompany(req);
}

const filterData = async function filterData(candidateDetail) {
    return filterReturnData.removeSensativeData(candidateDetail);
}

module.exports.endpoint = async function (req, res) {
    if(req.query.is_admin === 'true' || req.query.is_admin === true && req.auth.user.is_admin === 1) {
        if(req.body){
            let queryBody = req.body;

            let filter = {};
            if (queryBody.is_verify) filter.is_verify = 1;
            if (queryBody.status) filter.status = queryBody.status;
            if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;
            if (queryBody.disable_account) filter.disable_account = true;
            else filter.disable_account = false;

            let search = {};
            if (queryBody.search_word) {
                search.name = queryBody.search_word
            }

            let candidateDocs = await candidateSearch.candidateSearch(filter, search);

            for (let candidateDoc of candidateDocs.candidates) {
                await filterData(candidateDoc);
            }

            res.send(candidateDocs.candidates);
        }
        else {
            let filteredUsers = [];
            await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
                filterReturnData.removeSensativeData(userDoc);
                filteredUsers.push(userDoc);
            });

            if (filteredUsers && filteredUsers.length > 0) {
                res.send(filteredUsers);
            }

            else {
                errors.throwError("No candidate exists", 404)
            }
        }
    }
    if(req.auth.user.type === 'company'){
        console.log('comp is calling');
        let userId = req.auth.user._id;

        const candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, {});
        let filterArray = [];
        for(let candidateDetail of candidateDocs.candidates) {
            const filterDataRes = await filterData(candidateDetail , userId);
            filterArray.push(filterDataRes);
        }

        if(filterArray.length > 0) {
            res.send(filterArray);
        }
        else {
            errors.throwError("No candidates matched the search", 404);
        }
    }
}