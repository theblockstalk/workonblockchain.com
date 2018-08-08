var Q = require('q');
const users = require('../../../../../model/users');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');

module.exports = function (req,res)
{
    verified_candidate().then(function (err, data)
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

function verified_candidate()
{
    var deferred = Q.defer();
    users.find({type : 'candidate' , is_verify :1, is_approved :1 }, function (err, data)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(data)
        {
            var array = [];
            data.forEach(function(item)
            {
                array.push(item._id);
            });

            //console.log(array);
            CandidateProfile.find({ "_creator": {$in: array}}).populate('_creator').exec(function(err, result)
            {
                if (err){
                    logger.error(err.message, {stack: err.stack});
                    //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                }
                if (result)
                {
                    deferred.resolve(result);

                }
                else
                {
                    deferred.reject("Not Found");
                }
            });

        }

        else
        {
            deferred.reject("Not Found");
        }

    });

    return deferred.promise;
}