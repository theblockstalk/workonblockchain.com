const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for save candidate "resume(blockchain experience)" data in db//////////////////

module.exports = function (req,res)
{
	let userId = req.auth.user._id;
    resume_data(userId,req.body).then(function (err, data)
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

function resume_data(_id, userParam)
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateResume(_id);

    });

    function updateResume(_id)
    {
        var set =
            {
                why_work: userParam.why_work,
                commercial_platform: userParam.commercial_experience_year,
                experimented_platform: userParam.experimented_platform,
                platforms: userParam.platforms
            };
        CandidateProfile.update({ _creator: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
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