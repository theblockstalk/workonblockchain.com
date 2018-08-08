const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for save candidate "about(sign-up)" data in db//////////////////

module.exports = function (req,res)
{

    about_data(req.params._id,req.body).then(function (err, data)
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

function about_data(_id, userParam)
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
                first_name:userParam.first_name,
                last_name:userParam.last_name,
                github_account: userParam.github_account,
                stackexchange_account: userParam.exchange_account,
                contact_number: userParam.contact_number,
                nationality: userParam.nationality,
                image:userParam.image_src
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