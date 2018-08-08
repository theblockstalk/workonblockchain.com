var express = require('express');
var router = express.Router();
var userService = require('./services/user.service');
const multer = require('./middleware/multer');

/******** routes ****************/

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


module.exports = router;

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