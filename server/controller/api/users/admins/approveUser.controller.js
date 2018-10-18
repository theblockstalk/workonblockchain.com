const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');

const candidateApprovedEmail = require('../../../services/email/emails/candidateApproved');
const companyApprovedEmail = require('../../../services/email/emails/companyApproved');

const logger = require('../../../services/logger');

module.exports = function (req, res)
{
    approve_users(req.params._id, req.body).then(function (err, data)
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

function approve_users(_id , data)
{
	
    var deferred = Q.defer();
    users.findOne({ _id: _id}, function (err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(result)
            admin_approval(result);

        else
            deferred.reject('Email Not Found');


    });

    function admin_approval(userDoc)
    {
        var set =
            {
                is_approved: data.is_approve,

            };
        users.update({ _id: mongo.helper.toObjectID(userDoc._id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if (set.is_approved === 1)
            {
                CandidateProfile.findOne({ _creator: userDoc._id}, function (err, candidateDoc)
                {
                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if(candidateDoc)
                    {
                        if(userDoc.type === 'candidate')
                        {
                            console.log("if");
                            candidateApprovedEmail.sendEmail(userDoc.email, candidateDoc.first_name);
                            deferred.resolve({success:true});
                        }

                        else if(userDoc.type === 'company')
                        {
                            console.log("else if");
                            companyApprovedEmail.sendEmail(userDoc.email, candidateDoc.first_name);
                            deferred.resolve({success:true});
                        }

                        else
                        {
                            console.log("else");
                            deferred.resolve({success:false});
                        }
                    }

                    else
                        deferred.reject('Candidate not exists');


                });

            }
            else
            {
                deferred.resolve(set);
            }
        });
    }

    return deferred.promise;
}
