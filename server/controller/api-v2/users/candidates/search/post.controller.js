const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');
const enumerations = require('../../../../../model/enumerations');
const candidateSearch = require('../../candidate/searchCandidates');
const objects = require('../../../../services/objects');

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
    why_work: {
        type:String
    },
    programming_languages: {
        type:[{
            type: String,
            enum: enumerations.programmingLanguages
        }]
    },
    years_exp_min: {
        type: Number,
        min: 1,
        max: 20
    },
    roles: {
        type: [{
            type: String,
            enum: enumerations.workRoles
        }]
    },
    locations: {
        type:[{
            city: {
                type: String
            },
            name: {
                type: String
            }
        }]
    },
    current_currency: {
        type: String,
        enum: enumerations.currencies
    },
    current_salary: {
        type:Number,
        min: 0
    },
    expected_hourly_rate:  {
        type : Number,
        min:0,
    },
    base_country: {
        type:[{
            type: String,
            enum: enumerations.countries
        }]
    },
    work_type: {
        type: String,
        enum: enumerations.workTypes
    },
    name: {
        type: String
    }
});

const querySchema = new Schema({
    admin: {
        type: String,
        enum: ['true']
    }
});

module.exports.inputValidation = {
    body: bodySchema,
    query: querySchema
}

module.exports.auth = async function (req) {
    if(req.query.admin) await auth.isAdmin(req);
    else await auth.isValidCompany(req);
}

module.exports.endpoint = async function (req, res) {
    if(req.query.admin) {
        let queryBody = req.body;

        let filter = {};
        if (queryBody.is_verify) filter.is_verify = 1;
        if (queryBody.status) filter.status = queryBody.status;
        if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;
        if (queryBody.disable_account || queryBody.disable_account === false) filter.disable_account = queryBody.disable_account;

        let search = {};
        if (queryBody.name) {
            search.name = queryBody.name
        }

        if(!objects.isEmpty(filter) || !objects.isEmpty(search)) {
            let candidateDocs = await
            candidateSearch.candidateSearch(filter, search);

            for (let candidateDoc of candidateDocs.candidates) {
                filterReturnData.removeSensativeData(candidateDoc);
            }

            res.send(candidateDocs.candidates);
        }
        else{
            let filteredUsers = [];
            await users.findAndIterate({type: 'candidate'}, async function (userDoc) {
                filterReturnData.removeSensativeData(userDoc);
                filteredUsers.push(userDoc);
            });

            if (filteredUsers && filteredUsers.length > 0) res.send(filteredUsers);

            else errors.throwError("No candidate exists", 404);
        }
    }
    else{
        let userId = req.auth.user._id;
        let queryBody = req.body;
        let search = {}, order = {};
        if (queryBody.work_type) search.work_type = queryBody.work_type;
        if (queryBody.why_work) search.why_work = queryBody.why_work;
        if (queryBody.programming_languages) search.programming_languages = queryBody.programming_languages;
        if (queryBody.years_exp_min) search.years_exp_min = queryBody.years_exp_min;
        if (queryBody.locations) {
            if(queryBody.locations.find((obj => obj.name === 'Remote'))) {
                const index = queryBody.locations.findIndex((obj => obj.name === 'Remote'));
                queryBody.locations[index] = {remote : true};
            }
            search.locations = queryBody.locations;
        }
        if (queryBody.visa_needed) search.visa_needed = queryBody.visa_needed;
        if (queryBody.roles) search.roles = queryBody.roles;
        if (queryBody.blockchains) search.blockchains = queryBody.blockchains;
        if (queryBody.current_currency && queryBody.current_salary) {
            search.salary = {
                current_currency: queryBody.current_currency,
                current_salary: queryBody.current_salary
            }
        }

        if (queryBody.expected_hourly_rate && queryBody.current_currency) {
            search.hourly_rate = {
                expected_hourly_rate: queryBody.expected_hourly_rate,
                current_currency: queryBody.current_currency
            }
        }
        if(queryBody.base_country) search.base_country = queryBody.base_country;

        if (queryBody.blockchainOrder) order.blockchainOrder = queryBody.blockchainOrder;

        let candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, search, order);

        let filterArray = [];
        for(let candidateDetail of candidateDocs.candidates) {
            candidateDetail = await filterReturnData.candidateAsCompany(candidateDetail,userId);
            const filterDataRes = filterReturnData.removeSensativeData(candidateDetail);
            filterArray.push(filterDataRes);
        }

        if(filterArray.length > 0) res.send(filterArray);
        else errors.throwError("No candidates matched this search criteria", 404);
    }
}