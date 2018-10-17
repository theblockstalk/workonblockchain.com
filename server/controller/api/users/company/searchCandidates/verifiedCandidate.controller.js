var Q = require('q');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const filterReturnData = require('../../filterReturnData');
const chat = require('../../../../../model/chat');

module.exports = function (req,res)
{
    let userId = req.auth.user._id;

    verified_candidate(req.body, userId).then(function (err, data)
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



function verified_candidate(params,userId)
{
	
	var result_array = [];
	var array2 = [];
	var chat_data;
	var query_result=[];
    var deferred = Q.defer();
   
    users.find({type : 'candidate' , is_verify :1, is_approved :1 , disable_account : false }, function (err, userData)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(userData)
        {
            let ids=[];
            userData.forEach(function(item)
            {
                ids.push(item._id);
            });

            CandidateProfile.find({_creator : {$in : ids }}).populate('_creator').exec(function(err, candidateData)
            {

                if (err)
                    deferred.reject(err.name + ': ' + err.message);
                if(candidateData)
                {
                    if(candidateData.length <= 0){
                        deferred.resolve(candidateData);
                    }
                    else
                    {
                        var result_array = [];
                        candidateData.forEach(function(item)
                        {
                            filterReturnData.candidateAsCompany(item, userId).then(function(data) {
                                result_array.push(data);

                                if(candidateData.length === result_array.length){
                                    deferred.resolve(result_array);
                                }
                            })

                        })

                    }

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
