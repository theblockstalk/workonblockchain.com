const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
const EmployerProfile = require('../../../../model/employer_profile');
const chat = require('../../../../model/chat');

const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');


module.exports = function admin_company_filter(req,res)
{

    admin_company_filter_new(req.body).then(function (err, data)
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

function admin_company_filter_new(data)
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
   			            array.push(item.sender_id );
                    array.push(item.receiver_id );
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
   			                	 const nameFilter = { company_name : {'$regex' : data.word, $options: 'i' } };
   			                	 queryString.push(nameFilter);
   			                 }
   			                   			                 
   			                
   			                 if(queryString.length>0)
   			                 {
   			                	 var object = queryString.reduce((a, b) => Object.assign(a, b), {})
   			                	              
   			                	 const searchQuery = { $match: object };
   			                	 //console.log(searchQuery);
   			                	EmployerProfile.aggregate([    	
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
   			                    		 deferred.reject("No companies matched this search criteria");

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
   			                	deferred.reject("No companies matched this search criteria");
   			                 }
   			                 
   			                 
   			            }
   			            else
		                 {
		                	deferred.reject("No companies matched this search criteria");
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
          	 const nameFilter =  { company_name : {'$regex' : data.word, $options: 'i' } };
          	 queryString.push(nameFilter);
           }
           
           if(queryString.length>0)
           {
             	 var object = queryString.reduce((a, b) => Object.assign(a, b), {})
             	        
             	 const searchQuery = { $match: object };
             	 
             	EmployerProfile.aggregate([    	
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