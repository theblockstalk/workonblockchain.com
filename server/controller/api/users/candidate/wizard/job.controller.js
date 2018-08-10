const settings = require('../../../../../settings');
var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

///// for save  candidate "job(sign-up)" data in db//////////////////

module.exports = function (req,res)
{
    job_data(req.params._id,req.body).then(function (err, data)
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

function job_data(_id, userParam)
{
    var deferred = Q.defer();
    CandidateProfile.findOne({ _creator: _id }, function (err, data)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
            updateJob(_id);

    });

    function updateJob(_id)
    {
        var set =
            {
        		locations: userParam.country,
                roles: userParam.roles,
                interest_area: userParam.interest_area,
                expected_salary_currency: userParam.base_currency,
                expected_salary: userParam.expected_salary,
                availability_day: userParam.availability_day
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