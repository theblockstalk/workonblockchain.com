const settings = require('../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../model/users');
const CandidateProfile = require('../../model/candidate_profile');
const Pages = require('../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../model/chat');

const referUserEmail = require('./email/emails/referUser');
const chatReminderEmail = require('./email/emails/chatReminder');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('./logger');

var service = {};

////////admin functions/////////////////////////
service.admin_role = admin_role;
service.approve_users = approve_users;
service.search_by_name = search_by_name;
service.admin_candidate_filter = admin_candidate_filter;
service.admin_search_by_name=admin_search_by_name;
service.admin_company_filter=admin_company_filter;

////admin CMS function/////////////////////////////
service.get_content =get_content;
service.get_all_content=get_all_content;


module.exports = service;

/******************admin functions****************************/

function admin_role(data)
{
	var deferred = Q.defer();
	//console.log(data);
	 users.findOne({ email: data.email }, function (err, result) 
	 {
		 //console.log(result);
	      if (err){
			  logger.error(err.message, {stack: err.stack});
			  deferred.reject(err.name + ': ' + err.message);
	      }
	      if(result)
	    	  updateAdminRole(result._id);
	    	  
		  else   
			  deferred.reject('Email Not Found');

			        
	});
			 
	function updateAdminRole(_id) 
	{
		//console.log(_id);
		var set = 
		{
			 is_admin: 1,
			 
		};
		users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
		{
			if (err){ 
			   logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
			}
			else
			   deferred.resolve(set);
		});
	}
	return deferred.promise;
	
}


////////////////make user active and inactive/////////////

function approve_users(_id , data)
{
	var deferred = Q.defer();
	//console.log(data.is_approve);
	 users.findOne({ _id: _id}, function (err, result) 
	 {
	      if (err){
			  logger.error(err.message, {stack: err.stack});
			  deferred.reject(err.name + ': ' + err.message);
	      }
	      if(result)
	    	  admin_approval(result._id);
	    	  
		  else   
			  deferred.reject('Email Not Found');

			        
	});
			 
	function admin_approval(_id) 
	{
		//console.log(_id);
		var set = 
		{
				is_approved: data.is_approve,
			 
		};
		users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc) 
		{
			if (err){
			   logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
			}
			else
			   deferred.resolve(set);
		});
	}
	
	return deferred.promise;
}

//////////////////admin can searchCandidates candidate by name/////////////////

function search_by_name(word)
{
	//, $options: 'i'
	var deferred = Q.defer();
	
	CandidateProfile.find(
		{ $or : [  { first_name : {'$regex' : word, $options: 'i' } }, { last_name : {'$regex' : word , $options: 'i'} }]}
	).populate('_creator').exec(function(err, result)
    {
       if (err){
		   logger.error(err.message, {stack: err.stack});
		   //console.log(err);//deferred.reject(err.name + ': ' + err.message);
	   }		        
       if (result == '') 
       {
    	   deferred.reject("Not Found Any Data");
        		         
        } 
        else 
        {
        	deferred.resolve(result)
        }
     });
 
    return deferred.promise;
}

//////////////////admin can searchCandidates candidate by filter/////////////////

function admin_candidate_filter(data)
{
	var query_result = [];
	var company_rply = [];
	var deferred = Q.defer();
	//console.log(data);
	var arr = data.msg_tags;
	if(arr)
	{
		var picked = arr.find(o => o === 'is_company_reply');
		var employ_offer = arr.find(o => o === 'Employment offer accepted / reject');
		if(employ_offer)
		{
			var offered = ['job_offer_rejected', 'job_offer_accepted'];
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
	//console.log(company_rply);
	//console.log(data.msg_tags);
	if(data.is_approve!== -1 && data.msg_tags )
	{
		//console.log("both true");
		//console.log(data.msg_tags);
		users.find({type : 'candidate' , is_approved :data.is_approve }, function (err, dataa) 			
		{
			//console.log(dataa);
			if(err){
				logger.error(err.message, {stack: err.stack});
				deferred.reject(err.name + ': ' + err.message);
			}
			if(dataa)
			{        	
			   var array2 = [];
    		   dataa.forEach(function(item) 
    		   {
    		       array2.push(item._id );
    		   });
			   //console.log(array2);
			   CandidateProfile.find({"_creator" : {$in : array2}} ).populate('_creator').exec(function(err, result)
	    	   {
	    	    	//console.log(result);
	    	    	if (err){
						logger.error(err.message, {stack: err.stack});
						//console.log(err);//deferred.reject(err.name + ': ' + err.message);
	    	    	}	                		        
	    	    	if (result) 
	    	    	{
	    	    		result.forEach(function(item) 
	    	    		{
	    	    			 query_result.push(item );
	    	    		});
	    	    		
	    	    		chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data) 			
						{
			        		if(err)
			        			 deferred.reject(err.name + ': ' + err.message);
			        		if(data)
			        		{
			        			//console.log(data);
			        			var array = [];
			        		    data.forEach(function(item) 
			        		    {
			        		    	array.push(item.receiver_id );
			        		    });
	
			        		    CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result2)
			        		    {
			        		    	//console.log(result);
			        		    	if (err){
										logger.error(err.message, {stack: err.stack});
										//console.log(err);//deferred.reject(err.name + ': ' + err.message);
			        		    	}	                		        
			        		    	if (result2 == '' && dataa == '') 
			        		    	{
			        		    		  deferred.reject("Not Found Any Data");
			        		    		                		         
			        		    	} 
			        		    		               
			        		    	else 
			        		    	{
			        		    		 result2.forEach(function(item) 
			        		    		 {
			        		    			 query_result.push(item );
			        		    		 });
			        		    		//console.log(query_result.length);
			        		    		// var non_duplidated_data = array_unique($query_result, SORT_REGULAR);

			        		    		// var non_duplidated_data = _.uniq(query_result, '_id');
			        		    		 
			        		    		 deferred.resolve(query_result);
			        		    	 }
			        		      });
			        		    		        	
			        					        	//deferred.resolve(data);
			        		     }
			        					    	
						      });
	    	    		                		         
	    	    	       } 
	    	    	       else 
	    	    	       {
	    	    		        deferred.resolve(result)
	    	    		    }
	    	    	});
				        	
				  }
			        	
			        	//console.log(data);    	
			 });
			      
		}
	
	
	else if(data.is_approve!== -1)
	{
		//console.log("is_approve");
		users.find({type : 'candidate' , is_approved :data.is_approve }, function (err, data) 			
		{
			if(err){
				logger.error(err.message, {stack: err.stack});
				deferred.reject(err.name + ': ' + err.message);
			}
			if(data=='')
			{
				deferred.reject("Not Found Any Data");
				//console.log(data);    	
			}
			else
			{
				var array = [];
	    		data.forEach(function(item) 
	    		{
	    		     array.push(item._id );
	    		});
	    		//console.log(array);
	    		CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
	    	    {
	    	    	//console.log(result);
	    	    	if (err){
						logger.error(err.message, {stack: err.stack});
						//console.log(err);//deferred.reject(err.name + ': ' + err.message);
	    	    	}	                		        
	    	    	if (result == '') 
	    	    	{
	    	    		 deferred.reject("Not Found Any Data");
	    	    		                		         
	    	    	} 
	    	    	else 
	    	    	{
	    	    		 deferred.resolve(result)
	    	    	}
	    	    });
				        	
			}
				    	
		});
	}
	
	else if(data.msg_tags)
	{
		//console.log("msg_tags");
		//console.log(data.msg_tags);
		chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data) 			
		{
			if(err){
				logger.error(err.message, {stack: err.stack});
				deferred.reject(err.name + ': ' + err.message);
			}
			if(data)
			{
				        	//console.log(data);
				var array = [];
	    		data.forEach(function(item) 
	    		{
	    		     array.push(item.receiver_id );
	    		});
	    		//console.log(array);
	    		        	
	    		CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
	    		{
	    		     //console.log(result);
	    		     if (err) {
						logger.error(err.message, {stack: err.stack});
						//console.log(err);//deferred.reject(err.name + ': ' + err.message);
					 }          		        
	    		     if (result == '') 
	    		     {
	    		        deferred.reject("Not Found Any Data");
	    		                		         
	    		     } 
	    		     else 
	    		     {
	    		         deferred.resolve(result)
	    		     }
	    		 });	    		        	
				        	//deferred.resolve(data);
				}				    	
		 });
	}
    	 return deferred.promise;
}

//////////////////admin can searchCandidates company by name/////////////////


function admin_search_by_name(word)
{
	var deferred = Q.defer();
	
	EmployerProfile.find(
		{ $or : [  { first_name : {'$regex' : word ,$options: 'i' } }, { last_name : {'$regex' : word ,$options: 'i' } }]}
	).populate('_creator').exec(function(err, result)
    {
       if (err){
		   logger.error(err.message, {stack: err.stack});
		   //console.log(err);//deferred.reject(err.name + ': ' + err.message);
	   }		        
       if (result == '') 
       {
    	   deferred.reject("Not Found Any Data");
        		         
        } 
        else 
        {
        	deferred.resolve(result)
        }
     });
 
    return deferred.promise;
}

//////////////////admin can searchCandidates candidate by filter/////////////////


function admin_company_filter(data)
{
	var deferred = Q.defer();
	
	var query_result = [];
	var company_rply = [];
	var deferred = Q.defer();
	//console.log(data);
	var arr = data.msg_tags;
	if(arr)
	{
		var picked = arr.find(o => o === 'is_company_reply');
		var employ_offer = arr.find(o => o === 'Employment offer accepted / reject');
		if(employ_offer)
		{
			var offered = ['job_offer_rejected', 'job_offer_accepted'];
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
	
	
	if(data.is_approve!== -1 && data.msg_tags )
	{
		//console.log("both true");
		//console.log(data.msg_tags);
		users.find({type : 'company' , is_approved :data.is_approve }, function (err, dataa) 			
		{

			if(err)
				  deferred.reject(err.name + ': ' + err.message);
			if(dataa)
			{        	
			   var array2 = [];
    		   dataa.forEach(function(item) 
    		   {
    		       array2.push(item._id );
    		   });
			   
    		   EmployerProfile.find({"_creator" : {$in : array2}} ).populate('_creator').exec(function(err, result)
	    	   {
	    	    	
	    	    	if (err){
						logger.error(err.message, {stack: err.stack});
					}
	    	    		                		        
	    	    	if (result) 
	    	    	{
	    	    		result.forEach(function(item) 
	    	    		{
	    	    			 query_result.push(item );
	    	    		});
	    	    		
	    	    		chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data) 			
						{
			        		if(err){
								logger.error(err.message, {stack: err.stack});
			        			deferred.reject(err.name + ': ' + err.message);
			        		}
							if(data)
			        		{
			        			//console.log(data);
			        			var array = [];
			        		    data.forEach(function(item) 
			        		    {
			        		    	array.push(item.sender_id );
			        		    });
	
			        		    EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result2)
			        		    {
			        		    	//console.log(result);
			        		    	if (err){
										logger.error(err.message, {stack: err.stack});
										//console.log(err);//deferred.reject(err.name + ': ' + err.message);
			        		    	}	                		        
			        		    	if (result2 == '' && dataa == '') 
			        		    	{
			        		    		  deferred.reject("Not Found Any Data");
			        		    		                		         
			        		    	} 
			        		    		               
			        		    	else 
			        		    	{
			        		    		 result2.forEach(function(item) 
			        		    		 {
			        		    			 query_result.push(item );
			        		    		 });
			        		    		
			        		    		 
			        		    		 deferred.resolve(query_result);
			        		    	 }
			        		      });
			        		    		        	
			        					        	
			        		     }
			        					    	
						      });
	    	    		                		         
	    	    	       } 
	    	    	       else 
	    	    	       {
	    	    		        deferred.resolve(result)
	    	    		    }
	    	    	});
				        	
				  }
			        	
			        	//console.log(data);    	
			 });
			      
		}
	
	else if(data.is_approve!== -1)
	{
		//console.log("is_approve");
		users.find({type : 'company' , is_approved :data.is_approve }, function (err, data) 			
		{
			if(err){
				logger.error(err.message, {stack: err.stack});
				deferred.reject(err.name + ': ' + err.message);
			}
			if(data=='')
			{
				deferred.reject("Not Found Any Data");
				//console.log(data);    	
			}
			else
			{
				var array = [];
	    		data.forEach(function(item) 
	    		{
	    		     array.push(item._id );
	    		});
	    		//console.log(array);
	    		EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
	    	    {
	    	    	//console.log(result);
	    	    	if (err){
						logger.error(err.message, {stack: err.stack});
						//console.log(err);//deferred.reject(err.name + ': ' + err.message);
	    	    	}	                		        
	    	    	if (result == '') 
	    	    	{
	    	    		 deferred.reject("Not Found Any Data");
	    	    		                		         
	    	    	} 
	    	    	else 
	    	    	{
	    	    		 deferred.resolve(result)
	    	    	}
	    	    });
				        	
			}
				    	
		});
	}
	
	else if(data.msg_tags)
	{
		//console.log("msg_tags");
		//console.log(data.msg_tags);
		chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data) 			
		{
			if(err)
				 deferred.reject(err.name + ': ' + err.message);
			if(data)
			{
				        	//console.log(data);
				var array = [];
	    		data.forEach(function(item) 
	    		{
	    		     array.push(item.sender_id );
	    		});
	    		//console.log(array);
	    		        	
	    		EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
	    		{
	    		     //console.log(result);
	    		     if (err){
						 logger.error(err.message, {stack: err.stack});
						 //console.log(err);//deferred.reject(err.name + ': ' + err.message);
	    		     }           		        
	    		     if (result == '') 
	    		     {
	    		        deferred.reject("Not Found Any Data");
	    		                		         
	    		     } 
	    		     else 
	    		     {
	    		         deferred.resolve(result)
	    		     }
	    		 });	    		        	
				        	//deferred.resolve(data);
				}				    	
		 });
	}
	
	return deferred.promise;
}


function get_content(name)
{
	var deferred = Q.defer();
	Pages.find({page_name : name}).exec(function(err, result) 
    {
		
        if (err){ 
			logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
		}
        else{
        	//console.log(user);
            deferred.resolve(result);
        }
    });
	return deferred.promise;
}

function get_all_content()
{
	var deferred = Q.defer();
	Pages.find().exec(function(err, result) 
		    {
				
		        if (err){
					logger.error(err.message, {stack: err.stack});
		            deferred.reject(err.name + ': ' + err.message);
				}
		        else{
		        	//console.log(user);
		            deferred.resolve(result);
		        }
		    });
			return deferred.promise;
}

/**************end admin functions****************************/