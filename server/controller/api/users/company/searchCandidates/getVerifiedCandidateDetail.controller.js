var Q = require('q');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const filterReturnData = require('../../filterReturnData');
//////////get sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
	    let userId = req.auth.user._id;
	
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

function getVerifiedCandidateDetail(params,userId)
{
    var deferred = Q.defer();
    var arrayy=[];

    CandidateProfile.find({_creator : params._id}).populate('_creator').exec(function(err, candidateData)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(candidateData)
        {

                var result_array = [];

                filterReturnData.candidateAsCompany(candidateData[0].toObject(),userId).then(function(data) {
                    console.log(data);
                    deferred.resolve(data);

                })


            }
    });


    /*CandidateProfile.find({_creator : params._id}).populate('_creator' ).exec(function(err, result)
            {
                if (err)
                {
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                if(result)
                {	
                	var query_result = result[0].toObject();
                	
            		let anonymous = filterReturnData.removeSensativeData(query_result);
            		
                	if(params.company_reply == 1 )
                    {               		
        				 deferred.resolve(anonymous);
                    }
                	
                	if(params.company_reply == 0 )
                    {    
                		logger.debug("anonymous candidate : " + anonymous);
                        anonymous = filterReturnData.anonymousSearchCandidateData(anonymous);
                                              
                    }
                	deferred.resolve(anonymous);
                	
                	
                }
            });
*/
    return deferred.promise;

}