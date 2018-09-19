const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const Pages = require('../../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../model/employer_profile');
const chat = require('../../../../model/chat');

const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const referUserEmail = require('../../../services/email/emails/referUser');
const chatReminderEmail = require('../../../services/email/emails/chatReminder');
const referedUserEmail = require('../../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');

module.exports = function (req,res)
{
    admin_candidate_filter(req.body).then(function (err, data)
    {
        if (data)
        {
            res.json(data);
        }
        else
        {
            res.send(err);
        }
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function removeDups(names) {
	  let unique = {};
	  names.forEach(function(i) {
	    if(!unique[i]) {
	      unique[i] = true;
	    }
	  });
	  return Object.keys(unique);
	}

function admin_candidate_filter(data)
{

    var query_result = [];
    var company_rply = [];
    var deferred = Q.defer();
   
    var arr = data.msg_tags;
    if(arr)
    {
        var picked = arr.find(o => o === 'is_company_reply');
        var employ_offer = arr.find(o => o === 'Employment offer accepted / reject');
        if(employ_offer)
        {
            var offered = ['employment_offer_accepted', 'employment_offer_rejected'];
            //data.msg_tags = ['job_offer_rejected', 'job_offer_accepted'];
            offered.forEach(function(item)
            {
                data.msg_tags.push(item );
            });
        }

    }
    if(picked)
    {
        company_rply= [1,0];
    }

    if(data.msg_tags)
    {
    	
    	let queryString = [];
   		chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, query_data)
   		{
       
   			  if(err)
   			  {
   			       logger.error(err.message, {stack: err.stack});
   			       deferred.reject(err.name + ': ' + err.message);
   			  }
   			  if(query_data.length>0)
   			  {
   			       var array = [];
   			       query_data.forEach(function(item)
   			       {
   			            array.push(item.receiver_id );
                     array.push(item.sender_id );
   			       });
   			       
   			       if(array.length>0)
   			                 {
   			                	 const msgTagFilter = {"_creator" : {$in : array}};
   			                	queryString.push(msgTagFilter);
   			                	 
   			                 }
   			                 if(data.is_approve!== -1)
   			                 {
   			                	 
   			                	
   			                	const isApproveFilter = {"users.is_approved" : parseInt(data.is_approve)};
   			                	 queryString.push(isApproveFilter);
   			                 }
   			                 if(data.word)
   			                 {
   			                	 const nameFilter = { $or : [  { first_name : {'$regex' : data.word, $options: 'i' } }, { last_name : {'$regex' : data.word , $options: 'i'} }]};
   			                	 queryString.push(nameFilter);
   			                 }
   			                   			                 
   			                
   			                 if(queryString.length>0)
   			                 {
   			                	 var object = queryString.reduce((a, b) => Object.assign(a, b), {})
   			                	              
   			                	 const searchQuery = { $match: object };
   			                	 //console.log(searchQuery);
   			                	 CandidateProfile.aggregate([    	
   			                     {
   			                    	 $lookup:
   			                    	 {
   			                    		 from: "users",
   			                    		 localField: "_creator",
   			                    		 foreignField: "_id",
   			                    		 as: "users"
   			                    	 }
   			                     }, searchQuery]).exec(function(err, cand_result)
   			                    {
   			                    	 ////console.log(result);
   			                    	 if (err) {
   			                    		 logger.error(err.message, {stack: err.stack});
   			                    		 ////console.log(err);//deferred.reject(err.name + ': ' + err.message);
   			                    	 }
   			                    	 if (cand_result == '')
   			                    	 {
   			                    		 deferred.reject("No candidates matched this search criteria");

   			                    	 }
   			                    	 if(cand_result)
   			                    	 {
   			                    		   cand_result.forEach(function(item)
   			                             	{
   			                         			var query_result = item.users[0];          				
   			                         			var data = {_creator : query_result};
   			                        	 			filterReturnData.removeSensativeData(data);
   			                             	});
   			                        	 	deferred.resolve(cand_result);
   			                           
   			                    	 }
   			                    });
   			                 }
   			                 else
   			                 {
   			                	deferred.reject("No candidates matched this search criteria");
   			                 }
   			                 
   			                 
   			            }
   			            else
		                 {
		                	deferred.reject("No candidates matched this search criteria");
		                 }
   			});
   		   
    	
    }
    else
    {
    	let queryString=[];
    	if(data.is_approve!== -1)
           {
          	
          	
          	const isApproveFilter = {"users.is_approved" : parseInt(data.is_approve)};
          	 queryString.push(isApproveFilter);
           }
           if(data.word)
           {
          	 const nameFilter = { $or : [  { first_name : {'$regex' : data.word, $options: 'i' } }, { last_name : {'$regex' : data.word , $options: 'i'} }]};
          	 queryString.push(nameFilter);
           }
           
           if(queryString.length>0)
           {
             	 var object = queryString.reduce((a, b) => Object.assign(a, b), {})
             	        
             	 const searchQuery = { $match: object };
             	 
             	 CandidateProfile.aggregate([    	
                  {
                 	 $lookup:
                 	 {
                 		 from: "users",
                 		 localField: "_creator",
                 		 foreignField: "_id",
                 		 as: "users"
                 	 }
                  }, searchQuery]).exec(function(err, cand_result)
                 {
                 	 
                 	 if (err) {
                 		 logger.error(err.message, {stack: err.stack});
                 		 ////console.log(err);//deferred.reject(err.name + ': ' + err.message);
                 	 }
                 	 if (cand_result == '')
                 	 {
                 		 deferred.reject("Not Found Any Data");

                 	 }
                 	 if(cand_result)
                 	 {
                    		cand_result.forEach(function(item)
                        	{
                    			var query_result = item.users[0];          				
                    			var data = {_creator : query_result};
                   	 			filterReturnData.removeSensativeData(data);
                        	});
                   	 		deferred.resolve(cand_result);
                        
                 	 }
                 });
              }
              else
              {
             	deferred.reject("Not Found Any Data");
              }
	
    }
    
   
    return deferred.promise;
}

