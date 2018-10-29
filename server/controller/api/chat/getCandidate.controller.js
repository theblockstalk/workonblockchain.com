var Q = require('q');
const users = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const helper = require('./chatHelpers');
const EmployerProfile = require('../../../model/employer_profile');

const logger = require('../../services/logger');
const filterReturnData = require('../users/filterReturnData');

module.exports = function (req, res)
{
    helper.isAuthorizedForConversationNew(req.auth.user, req.body.sender_id, req.body.receiver_id)
	get_candidate(req.body.sender_id, req.body.receiver_id,req.body.is_company_reply,req.body.type).then(function (user)
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

function get_candidate(sender_id,receiver_id,is_company_reply,user_type)
{
    /*var deferred = Q.defer();

    users.find({ type: user_type }, function (err, user)
    {
       // //console.log(bcrypt.compareSync(password, user.password));
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
    var deferred = Q.defer();
	//old one-> db.users.find(  { type: user_type }  )
    query = '';
	if(user_type == 'company'){
		//console.log(sender_id);
		users.find({$and : [{ _id : sender_id }, { type : user_type } ]}, function (err, data)
		{

			if (err)
				deferred.reject(err.name + ': ' + err.message);
			if(data)
			{
				//console.log(data);
				var array = [];
				data.forEach(function(item)
				{
					array.push(item._id);
				});
				EmployerProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
				{
					if (err){
						////console.log(err);//deferred.reject(err.name + ': ' + err.message);
						logger.error(err.message, {stack: err.stack});
					}
					if (result)
					{
						var query_result = result[0].toObject();      
						query_result = filterReturnData.removeSensativeData(query_result);
						query_result = filterReturnData.anonymousCandidateData(query_result);
						deferred.resolve({
							users:query_result
						});
					}
					else
					{
						deferred.reject("Not Found");
					}
				});
			}
			else
			{
				deferred.reject("Not Found");
			}

		});
	}  
	else{
		//console.log(receiver_id);
		//console.log(user_type);
		users.find({$and : [{ _id : receiver_id }, { type : user_type } ]}, function (err, data)
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
				
				CandidateProfile.find({ "_creator": {$in: array}}).populate('_creator').exec(function(err, result)
				{
					if (err){
						logger.error(err.message, {stack: err.stack});
						////console.log(err);//deferred.reject(err.name + ': ' + err.message);
					}
					if (result)
					{
						var query_result = result[0].toObject();      
						query_result = filterReturnData.removeSensativeData(query_result);
						if(is_company_reply == 1){
							//console.log('matched');
						}
						else{
							query_result = filterReturnData.anonymousSearchCandidateData(query_result);
						}
						deferred.resolve({
							users:query_result
						});
					}
					else
					{
						deferred.reject("Not Found");
					}
				});
			}
			else
			{
				deferred.reject("Not Found");
			}

		});
	}
    return deferred.promise;
}