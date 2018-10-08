var Q = require('q');
const users = require('../../../../model/users');
const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');
const CandidateProfile = require('../../../../model/candidate_profile');

//use to get referral code of a user

module.exports = function (req, res) {
    ////console.log(req.body);
    get_refr_code(req.body).then(function (data){
       
        res.json(data);
    })
        .catch(function (err)
        {
            res.json({error: err});
        });
}

function get_refr_code(data){
    var deferred = Q.defer();

    users.findOne({ ref_link: data.code }, function (err, user)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        else
		{
            if(user)
        	{
                CandidateProfile.findOne({ "_creator": user._id }, function (err, user_profile)
                {
                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    else
                    {
                        if(user_profile) {
                            if (user_profile.first_name && user_profile.first_name !== '') {
                                deferred.resolve(user_profile.first_name);
                            }
                            else {
                                deferred.resolve(user.email);
                            }
                        }
                        else {
                            deferred.resolve(user.email);
                        }
                    }
                });
        	}
        	else{
                deferred.resolve(0);
            }

        }
    });
    return deferred.promise;
}
