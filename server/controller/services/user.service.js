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

/////////referal and chat functions////////////
service.refreal_email = refreal_email;
service.get_refr_code = get_refr_code;
service.get_candidate=get_candidate;
service.get_messages = get_messages;
service.get_user_messages = get_user_messages;
service.get_chat= get_chat;
service.save_chat_file = save_chat_file;
service.insert_message_job = insert_message_job;
service.update_job_message = update_job_message;
service.get_job_desc_msgs = get_job_desc_msgs;
service.set_unread_msgs_emails_status = set_unread_msgs_emails_status;
service.get_unread_msgs_of_user = get_unread_msgs_of_user;

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

service.update_chat_msg_status=update_chat_msg_status;
service.get_unread_msgs=get_unread_msgs;

module.exports = service;


function refreal_email(data){
	var deferred = Q.defer();
	referUserEmail.sendEmail(data)
	deferred.resolve('Email has been sent successfully.');
	return deferred.promise;
}

function get_refr_code(data){
	var deferred = Q.defer();

    users.findOne({ ref_link: data.code }, function (err, user) 
    {
        if (err){ 
			logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
		}
        else{
        	//console.log(user);
            deferred.resolve(user);
        }
    });
	return deferred.promise;
}



function get_candidate(user_type) 
{
	/*var deferred = Q.defer();

    users.find({ type: user_type }, function (err, user) 
    {
       // console.log(bcrypt.compareSync(password, user.password));
        if (err) deferred.reject(err.name + ': ' + err.message);
      
        if (user){
			deferred.resolve({ 
				users:user
			});
        } 
        else 
        {
            deferred.reject("Password didn't match");
            //deferred.resolve();
        }
    });
 
    return deferred.promise;*/
	//console.log(user_type);
	var deferred = Q.defer();
	users.find({type : user_type}, function (err, data) 			
	{
			
	        if (err) 
	             deferred.reject(err.name + ': ' + err.message);
	        if(data)
	        {
	        	var array = [];
	        	data.forEach(function(item) 
	        	{
	        	    array.push(item._id);
	        	});

	        	if(user_type == 'candidate'){
					CandidateProfile.find({ "_creator": {$in: array}}).populate('_creator').exec(function(err, result)
					{
					   if (err){
						   logger.error(err.message, {stack: err.stack});
						   //console.log(err);//deferred.reject(err.name + ': ' + err.message);
					   }				
					   if (result) 
					   {	
							deferred.resolve({ 
								users:result
							});         
						} 
						else 
						{
							deferred.reject("Not Found");
						}
					 });
				}
				else{
					EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
					{
					   if (err){
						   //console.log(err);//deferred.reject(err.name + ': ' + err.message);
						   logger.error(err.message, {stack: err.stack});
					   }				
					   if (result) 
					   {	
							deferred.resolve({ 
								users:result
							});         
						} 
						else 
						{
							deferred.reject("Not Found");
						}
					 });
				}
	        	 
	        	}
	        	
	        	else
	        	{
	        		deferred.reject("Not Found");
	        	}

	    });   
 
    return deferred.promise;
}

function get_messages(receiver_id,sender_id){
	//console.log(receiver_id)
	var deferred = Q.defer();
	/*$or : [
        { $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
        { $and : [ { receiver_id : {$regex: sender_id} } }, { sender_id : {$regex: receiver_id} } ] }
    ]*/
	chat.find({
		$or : [
			{ $and : [ { receiver_id : {$regex: receiver_id} }, { sender_id : {$regex: sender_id} } ] },
			{ $and : [ { receiver_id : {$regex: sender_id} }, { sender_id : {$regex: receiver_id} } ] }
		]	
		}, function (err, data) 
    {
		if (err){
			logger.error(err.message, {stack: err.stack});
			deferred.reject(err.name + ': ' + err.message);
        }
        else{
			//console.log(data);
			deferred.resolve({ 
				datas:data
			});
		}
	});
	return deferred.promise;
}

function get_user_messages(id){
	var deferred = Q.defer();
	chat.find({
		$or:[{receiver_id:{$regex: id}},{sender_id: {$regex: id}}]
	}).sort({_id: 'descending'}).exec(function(err, data)
    {
		if (err){
			logger.error(err.message, {stack: err.stack});
			deferred.reject(err.name + ': ' + err.message);
        }
        else{
			//console.log(data);
			deferred.resolve({ 
				datas:data
			});
		}
	});
	return deferred.promise;
}

function get_chat()
{
	 var deferred = Q.defer();  
	    chat.find().exec(function(err, result) 
	    {
	        if (err){
				logger.error(err.message, {stack: err.stack});
	            deferred.reject(err.name + ': ' + err.message);
			}
			else
	            deferred.resolve(result);

	    });

	    return deferred.promise;
}

function save_chat_file(data){
	var current_date = new Date();
	var day = current_date.getDate();
	if(day < 10){
		day = '0'+day;
	}
	var month = current_date.getMonth();
	month = month+1;
	if(month < 10){
		month = '0'+month;
	}
	var year = current_date.getFullYear();
	var hours = current_date.getHours();
	if(hours < 10){
		hours = '0'+hours;
	}
	var minutes = current_date.getMinutes();
	if(minutes < 10){
		minutes = '0'+minutes;
	}
	var seconds = current_date.getSeconds();
	if(seconds < 10){
		seconds = '0'+seconds;
	}
	var my_date = day+'/'+month+'/'+year+' '+hours+':'+minutes+':'+seconds;
	var deferred = Q.defer();
	let newChat = new chat({
		sender_id: data.sender_id,
		receiver_id: data.receiver_id,
		sender_name: data.sender_name,
		receiver_name: data.receiver_name,
		message: data.message,
		job_title: data.job_title,
		salary: data.salary,
		date_of_joining: data.date_of_joining,
		msg_tag: data.msg_tag,
		is_company_reply: data.is_company_reply,
		job_type: data.job_type,
		file_name: data.file_name,
		is_read: 0,
		date_created: my_date
	});

	newChat.save((err,data)=>
	{
		if(err){
			logger.error(err.message, {stack: err.stack});
			deferred.reject(err.name + ': ' + err.message);
		}
		else{
			//console.log('done');
			deferred.resolve({Success:'Msg sent'});
		}
	});
	return deferred.promise;
}

function insert_message_job(data){
	var current_date = new Date();
	var day = current_date.getDate();
	if(day < 10){
		day = '0'+day;
	}
	var month = current_date.getMonth();
	month = month+1;
	if(month < 10){
		month = '0'+month;
	}
	var year = current_date.getFullYear();
	var hours = current_date.getHours();
	if(hours < 10){
		hours = '0'+hours;
	}
	var minutes = current_date.getMinutes();
	if(minutes < 10){
		minutes = '0'+minutes;
	}
	var seconds = current_date.getSeconds();
	if(seconds < 10){
		seconds = '0'+seconds;
	}
	var my_date = day+'/'+month+'/'+year+' '+hours+':'+minutes+':'+seconds;
	var deferred = Q.defer();
	let newChat = new chat({
		sender_id: data.sender_id,
		receiver_id: data.receiver_id,
		sender_name: data.sender_name,
		receiver_name: data.receiver_name,
		message: data.message,
		job_title: data.job_title,
		salary: data.salary,
		date_of_joining: data.date_of_joining,
		msg_tag: data.msg_tag,
		is_company_reply: data.is_company_reply,
		job_type: data.job_type,
		file_name: data.file_name,
		is_job_offered: data.job_offered,
		is_read: 0,
		date_created: my_date
	});

	newChat.save((err,data)=>
	{
		if(err){
			logger.error(err.message, {stack: err.stack});
			deferred.reject(err.name + ': ' + err.message);
		}
		else{
			//console.log('done');
			deferred.resolve({Success:'Msg sent'});
		}
	});
	return deferred.promise;
}

function update_job_message(data){
	var deferred = Q.defer();
	//console.log(data.id);
		var set = 
		{
			 is_job_offered: data.status,
			 
		};
		chat.update({ _id: data.id},{ $set: set }, function (err, doc) 
		{
			if (err){ 
			   logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
			}
			else
			   deferred.resolve(set);
		});
	return deferred.promise;
}

function update_chat_msg_status(data){
	var deferred = Q.defer();
	//console.log(data);
		var set = 
		{
			is_read: 1,
			 
		};
		chat.update({
      $and : [
               { 
				/*$or : [
					{ $and : [ { receiver_id : {$regex: data.receiver_id} }, { sender_id : {$regex: data.sender_id} } ] },
					{ $and : [ { receiver_id : {$regex: data.sender_id} }, { sender_id : {$regex: data.receiver_id} } ] }
				]*/
				receiver_id: data.sender_id
               },
			   {
				   sender_id: data.receiver_id
			   },
               { 
                 is_read:data.status
               }
             ]
    } ,{ $set: set },{multi: true}, function (err, doc) 
		{
			if (err){ 
			   logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
			}
			else
			   deferred.resolve(set);
		});
	return deferred.promise;
}

function get_unread_msgs(){
	var deferred = Q.defer();
	//console.log('get all unread msgs');
	//chat.aggregate({$group : {"receiver_id" : "$by_user", num_tutorial : {$sum : 1}}}, function (err, result){
	chat.distinct("receiver_id", {is_read: 0}, function (err, result){
		if (err){
			deferred.reject(err.name + ': ' + err.message);
		}
		else{
			for(var i=0;i<result.length;i++){
				//console.log(result[i]);
				users.findOne({ _id: result[i],is_unread_msgs_to_send: true},{"email":1,"type":1}, function (err, newResult){
					if(newResult){
						if(newResult.type == 'candidate'){
							CandidateProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
								if (err){
									logger.error(err.message, {stack: err.stack});
									deferred.reject(err.name + ': ' + err.message);
								}
								if(query_data){
									chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
								}
							});
						}
						else{
							EmployerProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
								if (err){ 
									logger.error(err.message, {stack: err.stack});
									deferred.reject(err.name + ': ' + err.message);
								}
								if(query_data){
									chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
								}
							});
						}
					}
				});
			}
			deferred.resolve(result);
		}
	});
	return deferred.promise;
}

function get_job_desc_msgs(data){
	var deferred = Q.defer();
	chat.find({
		$and : [
		   { 
			 $and:[{receiver_id:{$regex: data.receiver_id}},{sender_id: {$regex: data.sender_id}}]
		   },
		   { 
			 msg_tag:data.msg_tag
		   }
		 ]
	}, function (err, data) 
    {
		if (err){
			logger.error(err.message, {stack: err.stack});
			deferred.reject(err.name + ': ' + err.message);
        }
        else{
			//console.log(data);
			deferred.resolve({ 
				datas:data
			});
		}
	});
	return deferred.promise;
}

function set_unread_msgs_emails_status(data){
	var deferred = Q.defer();
	//console.log(data.user_id);
		var set = 
		{
			 is_unread_msgs_to_send: data.status,
			 
		};
		users.update({ _id: data.user_id},{ $set: set }, function (err, doc) 
		{
			if (err){ 
			   logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
			}
			else
			   deferred.resolve(set);
		});
	return deferred.promise;
}

function get_unread_msgs_of_user(data){
	var deferred = Q.defer();
	chat.count({ $and : [
		   { 
			 $and:[{receiver_id:{$regex: data.receiver_id}},{sender_id: {$regex: data.sender_id}}]
		   },
		   { 
			 is_read:0
		   }
	] }, function (err, result){
		 if (err){ 
		       logger.error(err.message, {stack: err.stack});
			   deferred.reject(err.name + ': ' + err.message);
		 }
			else{
				//console.log(result);
				deferred.resolve({
					receiver_id: data.receiver_id,
					sender_id: data.sender_id,
					number_of_unread_msgs:result
				});
			}
	});
	return deferred.promise;
}

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

//////////////////admin can search candidate by name/////////////////

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

//////////////////admin can search candidate by filter/////////////////

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

//////////////////admin can search company by name/////////////////


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

//////////////////admin can search candidate by filter/////////////////


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