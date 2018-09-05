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
   
    users.find({type : 'candidate' , is_verify :1, is_approved :1 , disable_account : false }, function (err, data)
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


            chat.find({
                $or : [
                    { $and : [ { receiver_id : {$in: array} }, { sender_id : {$regex: params._id} } ] },
                    { $and : [ { receiver_id : {$regex: params._id} }, { sender_id : {$in: array} } ] }
                ]
            }).limit(2).exec(function (err, data)
            {
            	
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else{
                	var arrayy=[];
                	var datata= {datas : data ,ids : array };
    				arrayy.push(datata);

                	deferred.resolve(arrayy);
                   
                }

        });
        }
        else
        {
            deferred.reject("Not Found");
        }

    });

    return deferred.promise;
}


