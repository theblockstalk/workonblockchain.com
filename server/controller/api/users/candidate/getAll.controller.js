var Q = require('q');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

//////////get sign-up data from db of all candidate////////////

module.exports = function (req, res)
    {
        getAll().then(function (users)
        {
            res.send(users);
        })
            .catch(function (err)
            {
                res.status(400).send(err);
            });
    }

function getAll()
{
    var deferred = Q.defer();
    CandidateProfile.find().populate('_creator').exec(function(err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            deferred.resolve(result);

    });

    return deferred.promise;
}
