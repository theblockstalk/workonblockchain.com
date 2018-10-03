var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for update the candidate profile data ///////////////////

module.exports = function (req, res)
{
    let userId = req.auth.user._id;

    update_candidate_profile(userId, req.body).then(function (err, data)
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

function update_candidate_profile(_id,userParam)
{
    var deferred = Q.defer();
    var _id = _id;

    CandidateProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateUser(_id);

    });

    function updateUser(_id)
    {
        var set =
            {
                first_name:userParam.basics.first_name,
                last_name:userParam.basics.last_name,
                education_history :  userParam.educationHistory,
                work_history: userParam.workHistory,
                description :userParam.basics.summary

            };

        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                deferred.resolve(set);
        });
    }

    return deferred.promise;
}