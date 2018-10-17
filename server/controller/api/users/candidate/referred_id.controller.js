var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

/////////////////////////////////////////enter refered_id into db///////////

module.exports = function (req,res)
{
	let userId = req.auth.user._id;
    refered_id(userId).then(function (err, data)
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

function refered_id(idd , data)
{
    var deferred = Q.defer();

    CandidateProfile.findOne({ _creator: data.info }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateRefer(data._creator);
    });

    function updateRefer(_id)
    {
        var set =
            {
                refered_id: idd
            };

        users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
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