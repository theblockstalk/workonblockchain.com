const auth = require('../../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const EmployerProfile = require('../../../../../model/employer_profile');
const messages = require('../../../../../model/mongoose/messages');
const errors = require('../../../../services/errors');
const filterReturnData = require('../../../../api/users/filterReturnData');

module.exports.request = {
    type: 'get',
    path: '/users/companies/search'
};

const querySchema = new Schema({
    is_approved: Boolean,
    disable_account: Boolean,
    is_verify: Boolean,
    msg_tags: {
        type: [{
            type: String,
        }]
    },
    search_word: String
});

module.exports.inputValidation = {
    query: querySchema
}

const filterData = async function filterData(companyDetail) {
    return filterReturnData.removeSensativeData(companyDetail);
}

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
}

module.exports.endpoint = async function (req, res) {
    let queryBody = req.query;
    console.log(typeof queryBody.msg_tags);
    if(queryBody.disable_account === 'true' || queryBody.disable_account === true) queryBody.disable_account = true;
    else queryBody.disable_account = false;

    let userIds= [];
    let queryString = [];
    if(queryBody.msg_tags) {
        const messageDoc = await messages.find({msg_tag : {$in: queryBody.msg_tags}}, {sender_id: 1, receiver_id: 1});
        if(messageDoc && messageDoc.length > 0) {
            for (detail of messageDoc) {
                userIds.push(detail.sender_id);
                userIds.push(detail.receiver_id);
            }
            const msgTagFilter = {"_creator" : {$in : userIds}};
            queryString.push(msgTagFilter);
            if(queryBody.is_approved) {
                const isApproveFilter = {"users.is_approved" : parseInt(queryBody.is_approved)};
                queryString.push(isApproveFilter);
            }
            if(queryBody.is_verify) {
                const isApproveFilter = {"users.is_verify" : parseInt(queryBody.is_verify)};
                queryString.push(isApproveFilter);
            }

            if(queryBody.disable_account) {
                const isApproveFilter = {"users.disable_account" : parseInt(queryBody.disable_account)};
                queryString.push(isApproveFilter);
            }


            if(queryBody.search_word) {
                const nameFilter = { company_name : {'$regex' : queryBody.search_word, $options: 'i' } };
                queryString.push(nameFilter);
            }
            if(queryString.length > 0) {
                var object = queryString.reduce((a, b) => Object.assign(a, b), {})
                const searchQuery = {$match: object};
                const companyDoc = await EmployerProfile.aggregate([
                    {
                        $lookup:
                            {
                                from: "users",
                                localField: "_creator",
                                foreignField: "_id",
                                as: "users"
                            }
                    }, searchQuery]);
                if(companyDoc && companyDoc.length > 0) {
                    for(companyDetail of companyDoc) {
                        let query_result = companyDetail.users[0];
                        let data = {_creator : query_result};
                        await filterData(data );
                    }
                    res.send(companyDoc);
                }
                else {
                    errors.throwError("No companies matched this search criteria", 400)
                }
            }
        }
        else {
            errors.throwError("No companies matched this search criteria", 400)
        }
    }
    else {
        if(queryBody.is_approved) {
            const isApproveFilter = {"users.is_approved" : parseInt(queryBody.is_approved)};
            queryString.push(isApproveFilter);
        }
        if(queryBody.is_verify) {
            const isApproveFilter = {"users.is_verify" : parseInt(queryBody.is_verify)};
            queryString.push(isApproveFilter);
        }

        if(queryBody.disable_account) {
            const isApproveFilter = {"users.disable_account" : parseInt(queryBody.disable_account)};
            queryString.push(isApproveFilter);
        }

        if(queryBody.search_word) {
            const nameFilter = { "company_name" : {'$regex' : queryBody.search_word, $options: 'i' } };
            queryString.push(nameFilter);
        }
        if(queryString.length>0) {
            var object = queryString.reduce((a, b) => Object.assign(a, b), {})

            const searchQuery = {$match: object};

            const companyDoc = await EmployerProfile.aggregate([{
                $lookup:
                    {
                        from: "users",
                        localField: "_creator",
                        foreignField: "_id",
                        as: "users"
                    }
            }, searchQuery]);
            if (companyDoc && companyDoc.length > 0) {
                for (companyDetail of companyDoc) {
                    let query_result = companyDetail.users[0];
                    let data = {_creator: query_result};
                    await filterData(data);
                }
                res.send(companyDoc);
            }
            else {
                errors.throwError("No companies matched this search criteria", 400)
            }
        }
    }
}