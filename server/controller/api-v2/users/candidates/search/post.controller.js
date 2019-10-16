const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const users = require('../../../../../model/mongoose/users');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');
const enumerations = require('../../../../../model/enumerations');
const candidateSearch = require('./searchCandidates');
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
        type:String,
        enum: ['0','1']
    },
    word: String,
    msg_tags: [{
        type: String,
        enum: enumerations.chatMsgTypes
    }],
    why_work: {
        type:String
    },
    roles: [{
        type: String,
        enum: enumerations.workRoles
    }],
    required_skills : [{
        name: String,
        exp_year: Number
    }],
    visa_needed: Boolean,
    locations: [{
        _id: {
            type: String
        },
        city: {
            type: String
        },
        name: {
            type: String
        }
    }],
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
    base_country: [{
            type: String,
            enum: enumerations.countries
    }],
    work_type: {
        type: String,
        enum: enumerations.workTypes
    },
    name: {
        type: String
    },
    searchName: String,
    last_msg_received_day: Date,
    status_last_updated_day: Number
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
        queryBody.is_verify = parseInt(queryBody.is_verify);
        if (queryBody.is_verify || queryBody.is_verify === 0) filter.is_verify = queryBody.is_verify;
        if (queryBody.status) filter.status = queryBody.status;
        if (queryBody.msg_tags) filter.msg_tags = queryBody.msg_tags;
        if (queryBody.disable_account || queryBody.disable_account === false) filter.disable_account = queryBody.disable_account;
        if(queryBody.last_msg_received_day) filter.last_msg_received_day = queryBody.last_msg_received_day;
        if(queryBody.status_last_updated_day) filter.status_last_updated_day = queryBody.status_last_updated_day;

        let search = {};
        if (queryBody.name) {
            search.name = queryBody.name
        }

        if(!objects.isEmpty(filter) || !objects.isEmpty(search)) {
            let candidateDocs = await candidateSearch.candidateSearch(filter, search);

            for (let candidateDoc of candidateDocs.candidates) {
                filterReturnData.removeSensativeData(candidateDoc);
            }

            res.send(candidateDocs.candidates);
        }
        else{
            let sort = {"candidate.latest_status.timestamp" : -1};
            const candidateDocs = await users.findAndSort({type: 'candidate'}, sort);
            if(candidateDocs && candidateDocs.length > 0) {
                for (let candidateDoc of candidateDocs) {
                    filterReturnData.removeSensativeData(candidateDoc);
                }
                res.send(candidateDocs);
            }
            else errors.throwError("No candidate exists", 404);
        }
    }
    else {
        let userId = req.auth.user._id;
        let queryBody = req.body;
        let search = {};
        if (queryBody.work_type) search.work_type = queryBody.work_type;
        if (queryBody.why_work) search.why_work = queryBody.why_work;
        if (queryBody.required_skills) search.required_skills = queryBody.required_skills;
        if (queryBody.locations) {
            if(queryBody.locations.find((obj => obj.name === 'Remote'))) {
                const index = queryBody.locations.findIndex((obj => obj.name === 'Remote'));
                queryBody.locations[index] = {remote : true};
            }
            search.locations = queryBody.locations;
        }
        if (queryBody.visa_needed) search.visa_needed = queryBody.visa_needed;
        if (queryBody.roles) search.roles = queryBody.roles;
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

        let candidateDocs = await candidateSearch.candidateSearch({
            is_verify: 1,
            status: 'approved',
            disable_account: false
        }, search);

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