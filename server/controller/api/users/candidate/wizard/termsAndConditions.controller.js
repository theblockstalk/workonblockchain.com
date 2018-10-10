const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for save candidate "terms & condition(sign-up)" data in db//////////////////

module.exports = function (req,res)
{
	let userId = req.auth.user._id;
    terms_and_condition(userId,req.body).then(function (err, data)
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


function terms_and_condition(_id , userParam)
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
        if(userParam.terms)
        {
            var set =
                {
                    terms:userParam.terms,
                    marketing_emails: userParam.marketing,


                };
        }
        else
        {

            var set =
                {
                    
                    marketing_emails: userParam.marketing,


                };
        }

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