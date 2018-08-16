var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

//////////get sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
        get_public_profile(req.params._id).then(function (user)
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

function get_public_profile(_id)
{
	
    var deferred = Q.defer();
  
   
            CandidateProfile.find({_creator : _id}, { "first_name": 1,"_id": 0 , "why_work" : 1 , "description" : 1 }).populate('_creator' , "email").exec(function(err, result)
            {
                if (err)
                {
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else if(result)
                {
                	deferred.resolve(result);
                }
                else
                {
                	logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
            });
       


    

    return deferred.promise;

}