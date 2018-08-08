var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

//////////get sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
        getById(req.params.id).then(function (user)
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

function getById(_id)
{
    var deferred = Q.defer();
    //console.log(_id);
    CandidateProfile.findById(_id).populate('_creator').exec(function(err, result)
    {
        //console.log(result);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(!result)
        {
            CandidateProfile.find({_creator : _id}).populate('_creator').exec(function(err, result)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    deferred.reject(err.name + ': ' + err.message);
                }
                else
                    deferred.resolve(result);
            });
        }
        else
            deferred.resolve(result);


    });

    return deferred.promise;

}