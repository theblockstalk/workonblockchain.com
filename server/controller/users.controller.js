var config = require('config.json');
var express = require('express');
var router = express.Router();
var userService = require('../services/user.service');
const multer = require('../services/multer');

/******** routes ****************/
///////authenticated routes//////
router.post('/authenticate', authenticate);
router.put('/emailVerify/:email_hash' , emailVerify);
router.put('/forgot_password/:email' , forgot_password);
router.put('/reset_password/:hash' , reset_password);
router.put('/verify_client/:email' , verify_client);

////////candidate routes//////////
router.post('/register', register);
router.get('/', getAll);
router.get('/current/:id', getCurrent);
router.delete('/:_id', _delete);
router.put('/welcome/terms/:_id', terms_and_condition);
router.put('/welcome/about/:_id', about);
router.put('/welcome/job/:_id', job);
router.put('/welcome/resume/:_id', resume);
router.put('/welcome/exp/:_id', experience);
router.post('/image/:_id', image);
router.put('/refered_id/:id' , refered_id);
router.put('/update_profile/:_id' , update_candidate_profile);

////////company routes///////////
router.post('/create_employer', create_employer);
router.get('/company', getCompany);
router.get('/current_company/:id', getCurrentCompany);
router.put('/company_wizard/:_id',company_summary);
router.put('/about_company/:_id' , about_company);
router.post('/employer_image/:_id', employer_image);
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
router.post('/insert_message', insert_message);
router.post('/get_messages', get_messages);
router.post('/get_user_messages', get_user_messages);
router.get('/all_chat' , get_chat);
router.post('/upload_chat_file/:_id', upload_chat_file);
router.post('/insert_chat_file', insert_chat_file);
router.post('/insert_message_job', insert_message_job);
router.post('/update_job_message', update_job_message);

///////admin functions//////////////////////////////////
router.put('/admin_role', admin_role);
router.put('/approve/:_id'  , approve_users);
router.post('/search_by_name' , search_by_name);
router.post('/admin_candidate_filter' , admin_candidate_filter);
router.post('/admin_search_by_name' , admin_search_by_name);
router.post('/admin_company_filter' , admin_company_filter);
router.post('/update_chat_msg_status' , update_chat_msg_status);
router.get('/get_unread_msgs' , get_unread_msgs);

/////////admin CMS fucntions////////////////////////////////
router.put('/add_privacy_content'  , add_privacy_content);
router.get('/get_pages_content/:title', get_content);
router.get('/get_all_content', get_all_content);

module.exports = router;

/***********authentication functions **************/

////for login authentication to verify the user////////////////

function authenticate(req, res) 
{
    userService.authenticate(req.body.email, req.body.password).then(function (user) 
    {
        if (user) 
        {
            // authentication successful
            res.json(user);
        } 
        else 
        {
            // authentication failed
            res.json({msg: 'Username or password is incorrect'});
        }
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

///////////verify_email_address////////////////////////////
function emailVerify(req,res)
{
    //console.log(req.params.token);
     userService.emailVerify(req.params.email_hash).then(function (err, data) 
    {
    	 //console.log(data);
    	 console.log(err);
        if (data) 
        {
            res.json(data);
        } 
        else 
        {  
           res.send(err);
        }
    })
   

}

///////////forgot_password////////////////////////////
function verify_client(req,res)
{
    //console.log(req.params.email);
     userService.verify_client(req.params.email).then(function (err, data) 
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

///////////forgot_password////////////////////////////
function forgot_password(req,res)
{
    //console.log(req.params.email);
     userService.forgot_password(req.params.email).then(function (err, data) 
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

///////////reset_password////////////////////////////
function reset_password(req,res)
{
   // console.log(req.params.hash);
     userService.reset_password(req.params.hash,req.body).then(function (err, data) 
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

/***********authentication functions ends**************/

/*********** candidate functions *********************/

///////to create new candidate//////////////////////////// 

function register(req, res) 
{
    userService.create(req.body).then(function (data) 
    {
        res.json(data);
    })
    .catch(function (err) 
    {
        res.json({error: err});
    });
}

//////////get sign-up data from db of all candidate////////////

function getAll(req, res) 
{
	userService.getAll().then(function (users) 
    {   
        res.send(users);
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

//////////get sign-up data from db of specific candidate////////////

function getCurrent(req, res) 
{
    userService.getById(req.params.id).then(function (user) 
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


//////////delete sign-up data from db of specific candidate////////////

function _delete(req, res) 
{
    userService.delete(req.params._id).then(function () 
    {
        res.json('success');
    })
    .catch(function (err) 
    {
        res.status(400).send(err);
    });
}

///// for save candidate "terms & condition(sign-up)" data in db//////////////////
function terms_and_condition(req,res)
{
	 userService.terms_and_condition(req.params._id,req.body).then(function (err, data) 
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

///// for save candidate "about(sign-up)" data in db//////////////////
function about(req,res)
{

    userService.about_data(req.params._id,req.body).then(function (err, data) 
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

///// for save  candidate "job(sign-up)" data in db//////////////////

function job(req,res)
{
    userService.job_data(req.params._id,req.body).then(function (err, data) 
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

///// for save candidate "resume(blockchain experience)" data in db//////////////////

function resume(req,res)
{
    userService.resume_data(req.params._id,req.body).then(function (err, data) 
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

///// for save candidate "experience(history)" data in db//////////////////

function experience(req,res)
{
    //console.log(req.body);
     userService.experience_data(req.params._id,req.body).then(function (err, data) 
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
    //console.log(req.body.experience);
}



///// for save candidate "image(sign-up)"  in db///////////////////

function image(req, res) 
{
    multer(req, res, function (err)
    {
        console.log('req.file', req.file);
        if (err)
        {
            return
        }
        else
        {
			res.json('done');
            var path = req.file.filename;
            userService.save_image(path , req.params._id).then(function (err, about) 
            {
                console.log('userService.save_image')
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

    })
}

///// for update the candidate profile data ///////////////////

function update_candidate_profile(req, res) 
{
	userService.update_candidate_profile(req.params._id, req.body).then(function (err, data) 
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

/////////////////////////////////////////enter refered_id into db///////////
function refered_id(req,res)
{
	userService.refered_id(req.params.id, req.body).then(function (err, data) 
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

/*********candidate functions end **********/

/********employer functions****************/

///////////Create Employer////////////////////////////
function create_employer(req,res)
{

    userService.create_employer(req.body).then(function (err, data) 
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
    multer(req, res, function (err)
    {    //console.log(req.file.filename);
        if (err) 
        {
            return
        }
        else
        {
            var path = req.file.originalname;
            userService.save_employer_image(req.file.filename , req.params._id).then(function (err, about) 
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

    })    
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

//////////inserting message in DB ////////////

function insert_message(req, res) 
{
    userService.insert_message(req.body).then(function (data) 
    {
        if (data) 
        {
			console.log(data);
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
	console.log('upload_chat_file');
    multer(req, res, function (err)
    {    
        if (err) 
        {
            console.log(err);
        }
        else
        {
			console.log(req.file);
			console.log('done new');
			res.json(req.file.filename);
        }

    }) 
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


function add_privacy_content(req,res)
{
	userService.add_privacy_content(req.body).then(function (err, data) 
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