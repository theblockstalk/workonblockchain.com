const EmployerProfile = require('../../../../model/employer_profile');
const Chat = require('../../../../model/chat');
const errors = require('../../../services/errors');

const filterReturnData = require('../filterReturnData');

module.exports = async function (req,res) {
    let queryBody = req.body;
    let msgTags = queryBody.msg_tags;

    let companyReply;
    let userIds= [];
    let queryString = [];
    if(queryBody.msg_tags) {
        let picked = msgTags.find(o => o === 'is_company_reply');
        var employ_offer = msgTags.find(o => o === 'Employment offer accepted / reject');
        if(employ_offer) {
            var offered = ['employment_offer_accepted', 'employment_offer_rejected'];
            for (detail of offered) {
                queryBody.msg_tags.push(detail);
            }
        }
        if(picked) {
            companyReply= [1,0];
        }

        const chatDoc = await Chat.find({$or : [{msg_tag : {$in: queryBody.msg_tags}} , {is_company_reply: {$in: companyReply} }]}).lean();
        if(chatDoc && chatDoc.length > 0) {
            for (detail of chatDoc) {
                userIds.push(detail.sender_id);
                userIds.push(detail.receiver_id);
            }
            const msgTagFilter = {"_creator" : {$in : userIds}};
            queryString.push(msgTagFilter);
            if(queryBody.is_approve!== -1) {
                const isApproveFilter = {"users.is_approved" : parseInt(queryBody.is_approve)};
                queryString.push(isApproveFilter);
            }
            if(queryBody.word) {
                const nameFilter = { company_name : {'$regex' : queryBody.word, $options: 'i' } };
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
        if(queryBody.is_approve!== -1) {
            const isApproveFilter = {"users.is_approved" : parseInt(queryBody.is_approve)};
            queryString.push(isApproveFilter);
        }
        if(queryBody.word) {
            const nameFilter = { company_name : {'$regex' : queryBody.word, $options: 'i' } };
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

let filterData = async function filterData(companyDetail) {
    return filterReturnData.removeSensativeData(companyDetail);
}
