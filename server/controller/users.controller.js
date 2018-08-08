var express = require('express');
var router = express.Router();
var userService = require('./services/user.service');
const multer = require('./middleware/multer');

/******** routes ****************/

////////company routes///////////
router.get('/company', getCompany);
router.get('/current_company/:id', getCurrentCompany);
router.put('/company_wizard/:_id',company_summary);
router.put('/about_company/:_id' , about_company);
router.post('/employer_image/:_id', multer.single('photo'), employer_image);
router.put('/update_company_profile/:_id' , update_company_profile);
//router.put('/skills_search' , skills_search);

//////////filters functions/////////////
/*router.post('/search_skill' , search_skill);
router.post('/search_location', search_location);
router.post('/search_position', search_position);
router.post('/search_blockchain' , search_blockchain);
router.post('/search_salary', search_salary);
router.post('/search_availibility', search_availibility);*/
router.post('/search_word', search_word);
router.post('/filter', filter);
router.get('/verified_candidate', verified_candidate);

//////referral and chat routes////
router.post('/send_refreal',refreal_email_send);
router.post('/get_refrence_code',get_refrence_code);
router.post('/get_candidate', get_candidate);
router.post('/get_messages', get_messages);
router.post('/get_user_messages', get_user_messages);
router.get('/all_chat' , get_chat);
router.post('/upload_chat_file/:_id', multer.single('photo'), upload_chat_file);
router.post('/insert_chat_file', insert_chat_file);
router.post('/insert_message_job', insert_message_job);
router.post('/update_job_message', update_job_message);
router.post('/get_unread_msgs_of_user', get_unread_msgs_of_user);

///////admin functions//////////////////////////////////
router.put('/admin_role', admin_role);
router.put('/approve/:_id'  , approve_users);
router.post('/search_by_name' , search_by_name);
router.post('/admin_candidate_filter' , admin_candidate_filter);
router.post('/admin_search_by_name' , admin_search_by_name);
router.post('/admin_company_filter' , admin_company_filter);
router.post('/update_chat_msg_status' , update_chat_msg_status);
router.get('/get_unread_msgs' , get_unread_msgs);
router.post('/get_job_desc_msgs' , get_job_desc_msgs);
router.post('/set_unread_msgs_emails_status' , set_unread_msgs_emails_status);

/////////admin CMS fucntions////////////////////////////////
router.get('/get_pages_content/:title', get_content);
router.get('/get_all_content', get_all_content);


const logger = require('../controller/services/logger');

module.exports = router;

/********employer functions****************/

//////////get sign-up data from db of all companies////////////

function getCompany(req, res) 
{
    userService.getCompany().then(function (users) 
    {   
        res.send(users);
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}



//////////get sign-up data from db of specific company////////////
function getCurrentCompany(req, res) 
{
    userService.get_company_byId(req.params.id).then(function (user) 
    {
        if (user) 
        {
            res.send(user);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

///////////add company summary or Terms& conditions in db////////////////////////////
function company_summary(req,res)
{
    
    userService.company_summary(req.params._id,req.body).then(function (err, data) 
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

///////////add company summary or Terms& conditions in db////////////////////////////
function about_company(req,res)
{
    
    userService.about_company(req.params._id,req.body).then(function (err, data) 
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


///// for save "employer image(sign-up)"  in db///////////////////

function employer_image(req, res) 
{
   
			console.log(req.file);
			console.log('done new');
			res.json(req.file.filename);
			let path;
            if (settings.isLiveApplication()) {
                path = req.file.location; // for S3 bucket
            } else {
                path = settings.FILE_URL+req.file.filename;
            }
			userService.save_employer_image(path , req.params._id).then(function (err, about) 

            {
                if (about) 
                {
                    res.json(about);
                } 
                else 
                {
                    res.json(err);
                }
            })
            .catch(function (err) 
            {
                res.json({error: err});
            }); 

          

}

////////// update company profile data ///////////////////////////

function update_company_profile(req,res)
{
	 userService.update_company_profile(req.params._id,req.body).then(function (err, data) 
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


 
/**********employer functions end *************/

/**********filters function*******************/

function search_skill(req,res)
{
    //console.log(req.body.search);
	 // console.log(req.body.search);

    userService.search_skill(req.body.search).then(function (err, data) 
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

function search_location(req,res)
{
  
    userService.search_location(req.body.search).then(function (err, data) 
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

function search_position(req,res)
{
    //console.log(req.body.search);
    userService.search_position(req.body.search).then(function (err, data) 
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

function search_blockchain(req,res)
{
	 userService.search_blockchain(req.body.search).then(function (err, data) 
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

function search_salary(req,res)
{
    //console.log(req.body.search);
    userService.search_salary(req.body.search).then(function (err, data) 
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

function search_availibility(req,res)
{
	userService.search_availibility(req.body.search).then(function (err, data) 
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

function search_word(req,res)
{
	userService.search_word(req.body.search).then(function (err, data) 
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

function filter(req,res)
{  
	userService.filter(req.body).then(function (err, data) 
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

function verified_candidate(req,res)
{
	userService.verified_candidate().then(function (err, data) 
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



/**********filters function end*******************/

//to send email for referral
function refreal_email_send(req, res) {
    userService.refreal_email(req.body).then(function (data){
        console.log('done');
		res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//use to get referral code of a user
function get_refrence_code(req, res) {
	//console.log(req.body);
    userService.get_refr_code(req.body).then(function (data){
        console.log('done');
		res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//////////getting all candidates ////////////

function get_candidate(req, res) 
{
    userService.get_candidate(req.body.type).then(function (user) 
    {
        if (user) 
        {
            res.send(user);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}


//////////get messages of a user/company from DB ////////////

function get_messages(req, res) 
{
    userService.get_messages(req.body.receiver_id,req.body.sender_id).then(function (data) 
    {
        if (data) 
        {
            res.send(data);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////get messages of a user from DB ////////////

function get_user_messages(req, res) 
{
    userService.get_user_messages(req.body.id).then(function (data) 
    {
        if (data) 
        {
            res.send(data);
        } 
        else 
        {
            res.sendStatus(404);
        }
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

function get_chat(req,res)
{
	 userService.get_chat().then(function (data) 
			    {
			        if (data) 
			        {
			            res.send(data);
			        } 
			        else 
			        {
			            res.sendStatus(404);
			        }
			    })
			    .catch(function (err) 
			    {
			        res.status(400).send(err);
			    });

}

///// file uploadPhoto for chat ///////////////////

function upload_chat_file(req, res) 
{
    console.log(req.file);
    console.log('done new');
	let path;
    if (settings.isLiveApplication()) {
        path = req.file.location; // for S3 bucket
    } else {
        path = settings.FILE_URL+req.file.filename;
    }
    res.json(path);
}

//inserting chat file in db
function insert_chat_file(req,res){
	userService.save_chat_file(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function insert_message_job(req,res){
	userService.insert_message_job(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function update_job_message(req,res){
	userService.update_job_message(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function update_chat_msg_status(req,res){
	userService.update_chat_msg_status(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function get_unread_msgs(req,res){
	userService.get_unread_msgs().then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function get_job_desc_msgs(req,res){
	userService.get_job_desc_msgs(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function set_unread_msgs_emails_status(req,res){
	userService.set_unread_msgs_emails_status(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

function get_unread_msgs_of_user(req,res){
	userService.get_unread_msgs_of_user(req.body).then(function (err, about) 
	{
		if (about) 
		{
			res.json(about);
		} 
		else 
		{
			res.json(err);
		}
	})
	.catch(function (err) 
	{
		res.json({error: err});
	});
}

/**************admin functions************************************/

function admin_role(req,res)
{
	 userService.admin_role(req.body).then(function (data) 
	 {
		 if (data) 
		 {
			  res.send(data);
	     } 
		 else 
	     {
			  res.sendStatus(404);
		 }
	})
	.catch(function (err) 
	{
		res.status(400).send(err);
	});
}

////approve user by admin///////////////////////////////////////////
function approve_users(req, res) 
{
	userService.approve_users(req.params._id, req.body).then(function (err, data) 
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

function search_by_name(req,res)
{
	userService.search_by_name(req.body.search).then(function (err, data) 
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


function admin_candidate_filter(req,res)
{
	userService.admin_candidate_filter(req.body).then(function (err, data) 
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

function admin_search_by_name(req,res)
{
	userService.admin_search_by_name(req.body.search).then(function (err, data) 
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

function admin_company_filter(req,res)
{
	//console.log(req.body);
	userService.admin_company_filter(req.body).then(function (err, data) 
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

function get_content(req,res)
{
	userService.get_content(req.params.title).then(function (err, data) 
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

function get_all_content(req,res)
{
	userService.get_all_content().then(function (err, data) 
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

/*********end admin functions************************************/