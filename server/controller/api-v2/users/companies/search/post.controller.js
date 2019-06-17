const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const EmployerProfile = require('../../../../../model/employer_profile');
const messages = require('../../../../../model/mongoose/messages');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');
const enumerations = require('../../../../../model/enumerations');
const company = require('../../../../../model/mongoose/company');

module.exports.request = {
    type: 'post',
    path: '/users/companies/search'
};

const bodySchema = new Schema({
    is_approved: {
        type:String,
        enum: ['0','1']
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
    admin: {
        type: String,
        enum: ['true']
    }
});

module.exports.inputValidation = {
    body: bodySchema,
    query: querySchema
};

const filterData = async function filterData(companyDetail) {
    return filterReturnData.removeSensativeData(companyDetail);
}

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
    if(!req.query.admin) throw new Error("User is not an admin", 403);
}

module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;

    let userIds= [];
    let queryString = [];
    if(queryBody.msg_tags) {
        const messageDoc = await messages.findMany({msg_tag: {$in: queryBody.msg_tags}}, {sender_id: 1, receiver_id: 1});
        if (messageDoc && messageDoc.length > 0) {
            for (detail of messageDoc) {
                userIds.push(detail.sender_id);
                userIds.push(detail.receiver_id);
            }
            const msgTagFilter = {"_creator": {$in: userIds}};
            queryString.push(msgTagFilter);
        }
    }
    queryBody.is_approved = parseInt(queryBody.is_approved);
    if(queryBody.is_approved || queryBody.is_approved === 0) {
        const isApproveFilter = {"users.is_approved" : queryBody.is_approved};
        queryString.push(isApproveFilter);
    }
    if(queryBody.is_verify) {
        const isApproveFilter = {"users.is_verify" : 1};
        queryString.push(isApproveFilter);
    }

    if(queryBody.disable_account || queryBody.disable_account === false){
        const isApproveFilter = {"users.disable_account" : queryBody.disable_account};
        queryString.push(isApproveFilter);
    }

    if(queryBody.search_word) {
        const nameFilter = { "company_name" : {'$regex' : queryBody.search_word, $options: 'i' } };
        queryString.push(nameFilter);
    }
    console.log(queryString);
    if(queryString.length>0) {
        var object = queryString.reduce((a, b) => Object.assign(a, b), {})

        const searchQuery = {$match: object};

        const companyDoc = await company.aggregate(searchQuery);
        if (companyDoc && companyDoc.length > 0) {
            for (companyDetail of companyDoc) {
                let query_result = companyDetail.users[0];
                let data = {_creator: query_result};
                await filterData(data);
            }
            res.send(companyDoc);
        }
        else errors.throwError("No companies matched this search criteria", 400);
    }
}