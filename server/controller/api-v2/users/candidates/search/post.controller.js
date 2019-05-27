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
    why_work: {
        type:String
    },
    programming_languages: {
        type:[{
            language: {
                type: String,
                enum: enumerations.programmingLanguages
            },
            exp_year: {
                type: String,
                enum: enumerations.experienceYears
            }
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
        type: String,
        enum: enumerations.countries
    },
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
            if (queryBody.why_work) {
                search.name = queryBody.why_work
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
        if(req.body){
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
                const filterDataRes = await filterData(candidateDetail , userId);
                filterArray.push(filterDataRes);
            }

            if(filterArray.length > 0) {
                res.send(filterArray);
            }
            else {
                errors.throwError("No candidates matched this search criteria", 404);
            }
        }
        else {
            console.log('comp is calling');
            let userId = req.auth.user._id;

            const candidateDocs = await
            candidateSearch.candidateSearch({
                is_verify: 1,
                status: 'approved',
                disable_account: false
            }, {});
            let filterArray = [];
            for (let candidateDetail of candidateDocs.candidates) {
                const filterDataRes = await
                filterData(candidateDetail, userId);
                filterArray.push(filterDataRes);
            }

            if (filterArray.length > 0) {
                res.send(filterArray);
            }
            else {
                errors.throwError("No candidates matched the search", 404);
            }
        }
    }
}