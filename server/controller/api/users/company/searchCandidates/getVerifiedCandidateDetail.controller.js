var Q = require('q');
const CandidateProfile = require('../../../../../model/candidate_profile');
const logger = require('../../../../services/logger');
const filterReturnData = require('../../filterReturnData');
//////////get sign-up data from db of specific candidate////////////

module.exports = function (req, res)
    {
        let userId = req.auth.user._id;
        getVerifiedCandidateDetail(req.body,userId).then(function (user)
        {
            if (user)
            {
                res.send(user);
            }
            else
            {
                res.sendStatus(404);
            }
        })
            .catch(function (err)
            {
                res.status(400).send(err);
            });
    }

function getVerifiedCandidateDetail(params,userId)
{
    var deferred = Q.defer();
    var arrayy=[];

    CandidateProfile.find({_creator : params._id}).populate('_creator').exec(function(err, candidateData)
    {

        if (err)
            deferred.reject(err.name + ': ' + err.message);
        if(candidateData && candidateData.length > 0)
        {
                filterReturnData.candidateAsCompany(candidateData[0].toObject(),userId).then(function(data) {
                   deferred.resolve(data);
                })
            }
    });



    return deferred.promise;

}