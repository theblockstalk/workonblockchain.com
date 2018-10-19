const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for save candidate "experience(history)" data in db//////////////////

module.exports = function (req,res)
{
	let userId = req.auth.user._id;
    experience_data(userId,req.body).then(function (err, data)
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

function experience_data(_id, userParam)
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateExp(_id);

    });

    function updateExp(_id)
    {

        var set =
            {
                programming_languages: userParam.language_exp,
                education_history :  userParam.education,
                work_history: userParam.work,
                description :userParam.detail.intro,

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