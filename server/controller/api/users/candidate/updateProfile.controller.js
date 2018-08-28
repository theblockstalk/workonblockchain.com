var Q = require('q');
var mongo = require('mongoskin');
const CandidateProfile = require('../../../../model/candidate_profile');
const logger = require('../../../services/logger');

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
    // console.log(userParam);
    //console.log(userParam.education);
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
                first_name:userParam.detail.first_name,
                last_name:userParam.detail.last_name,
                github_account: userParam.detail.github_account,
                stackexchange_account: userParam.detail.exchange_account,
                contact_number: userParam.detail.contact_number,
                nationality: userParam.detail.nationality,
                locations: userParam.detail.country,
                roles: userParam.detail.roles,
                interest_area: userParam.detail.interest_area,
                expected_salary_currency: userParam.detail.base_currency,
                expected_salary: userParam.detail.expected_salary,
                availability_day: userParam.detail.availability_day,
                why_work: userParam.detail.why_work,
                commercial_platform: userParam.detail.commercial_experience_year,
                experimented_platform: userParam.detail.experimented_platform,
                platforms: userParam.detail.platforms,
                current_salary: userParam.detail.salary,
                current_currency : userParam.detail.current_currency,                
                programming_languages: userParam.detail.language_experience_year,
                // work_experience_year : userParam.detail.platform_exp,
                education_history :  userParam.education,
                work_history: userParam.work,
                description :userParam.detail.intro

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