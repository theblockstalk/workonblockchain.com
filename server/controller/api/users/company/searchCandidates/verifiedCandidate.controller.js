var Q = require('q');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const filterReturnData = require('../../filterReturnData');
const chat = require('../../../../../model/chat');

module.exports = function (req,res)
{
    verified_candidate(req.body).then(function (err, data)
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



function verified_candidate(params)
{
	
	var result_array = [];
	var array2 = [];
	var chat_data;
	var query_result=[];
    var deferred = Q.defer();
   
    users.find({type : 'candidate' , is_verify :1, is_approved :1 , disable_account : false }, function (err, result)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(result)
        {
                    	
        	var result_array = [];
       	 	result.forEach(function(item)
            {
       	 		result_array.push(item._id);
            });
       	 	
        	var ids_arrayy=[];
          	var datata= {ids : result_array };
          	ids_arrayy.push(datata);

          	deferred.resolve(ids_arrayy);

           
        }
        else
        {
            deferred.reject("Not Found");
        }

    });

    return deferred.promise;
}


