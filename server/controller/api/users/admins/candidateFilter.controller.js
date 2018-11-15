var _ = require('lodash');
const CandidateProfile = require('../../../../model/candidate_profile');
const Chat = require('../../../../model/chat');
const errors = require('../../../services/errors');

const logger = require('../../../services/logger');
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
           offered.forEach(function(item) {
               queryBody.msg_tags.push(item );
           });
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
               const nameFilter = { $or : [  { first_name : {'$regex' : queryBody.word, $options: 'i' } }, { last_name : {'$regex' : queryBody.word , $options: 'i'} }]};
               queryString.push(nameFilter);
           }
           if(queryString.length > 0) {
               var object = queryString.reduce((a, b) => Object.assign(a, b), {})
               const searchQuery = {$match: object};
               const candidateDoc = await CandidateProfile.aggregate([
                   {
                       $lookup:
                           {
                               from: "users",
                               localField: "_creator",
                               foreignField: "_id",
                               as: "users"
                           }
                   }, searchQuery]);
               if(candidateDoc && candidateDoc.length > 0) {
                   for(candidateDetail of candidateDoc) {
                       let query_result = candidateDetail.users[0];
                       let data = {_creator : query_result};
                       await filterData(data );
                   }
                   res.send(candidateDoc);
			   }
			   else {
                   errors.throwError("No candidates matched this search criteria", 400)
               }
           }

	   }
	   else {
           errors.throwError("No candidates matched this search criteria", 400)
       }
   }
   else {
       if(queryBody.is_approve!== -1) {
           const isApproveFilter = {"users.is_approved" : parseInt(queryBody.is_approve)};
           queryString.push(isApproveFilter);
       }
       if(queryBody.word) {
           const nameFilter = { $or : [  { first_name : {'$regex' : queryBody.word, $options: 'i' } }, { last_name : {'$regex' : queryBody.word , $options: 'i'} }]};
           queryString.push(nameFilter);
       }

       if(queryString.length>0) {
           var object = queryString.reduce((a, b) => Object.assign(a, b), {})

           const searchQuery = {$match: object};

           const candidateDoc = await CandidateProfile.aggregate([{
               $lookup:
                   {
                       from: "users",
                       localField: "_creator",
                       foreignField: "_id",
                       as: "users"
                   }
           }, searchQuery]);
           if (candidateDoc && candidateDoc.length > 0) {
               for (candidateDetail of candidateDoc) {
                   let query_result = candidateDetail.users[0];
                   let data = {_creator: query_result};
                   await filterData(data);
               }
               res.send(candidateDoc);
           }
           else {
               errors.throwError("No candidates matched this search criteria", 400)
           }
       }
   }
}

let filterData = async function filterData(candidateDetail) {
    return filterReturnData.removeSensativeData(candidateDetail);
}
