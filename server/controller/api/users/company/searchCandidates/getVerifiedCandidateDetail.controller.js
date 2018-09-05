var Q = require('q');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const filterReturnData = require('../../filterReturnData');
//////////get sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
	    //let userId = req.auth.user._id;
	
        getVerifiedCandidateDetail(req.body).then(function (user)
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

function getVerifiedCandidateDetail(params)
{
    var deferred = Q.defer();
    var arrayy=[];
    
    CandidateProfile.find({_creator : params._id}).populate('_creator' ).exec(function(err, result)
            {
                if (err)
                {
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                {	
                	if(params.company_reply == 1 )
                    {               		
                        var query_result = result[0].toObject();  
                		let anonymous = filterReturnData.removeSensativeData(query_result);
                		
        				 deferred.resolve(anonymous);
                    }
                	
                	if(params.company_reply == 0 )
                    {
                		var query_result = result[0].toObject();      
                        let anonymisedCandidates = filterReturnData.anonymousSearchCandidateData(query_result);
                       
                        deferred.resolve(anonymisedCandidates);
                    }
                	
                	
                }
            });

    return deferred.promise;

}