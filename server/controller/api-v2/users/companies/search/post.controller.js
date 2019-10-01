const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const messages = require('../../../../../model/mongoose/messages');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../filterReturnData');
const enumerations = require('../../../../../model/enumerations');
const companies = require('../../../../../model/mongoose/companies');
const objects = require('../../../../services/objects');

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
        type:String,
        enum: ['0','1']
    },
    msg_tags: {
        type: [{
            type: String,
            enum: enumerations.chatMsgTypes
        }]
    },
    search_word: {
        type:String
    },
    last_msg_received_day: Number,
    created_after: Number
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
    queryBody.is_verify = parseInt(queryBody.is_verify);
    if(queryBody.is_verify || queryBody.is_verify === 0) {
        const isApproveFilter = {"users.is_verify" : queryBody.is_verify};
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
    if(queryBody.last_msg_received_day) {
        queryString.push({
            "users.conversations": {
                "$elemMatch":{"last_message":{$gte: objects.getDateFromDays(queryBody.last_msg_received_day)}}
            }
        });
    }
    if(queryBody.created_after){
        queryString.push({"users.created_date": {$gte: objects.getDateFromDays(queryBody.created_after)}});
    }

    if(queryString.length>0) {
        var object = queryString.reduce((a, b) => Object.assign(a, b), {})

        const searchQuery = {$match: object};

        const companyDoc = await companies.aggregate(searchQuery);
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