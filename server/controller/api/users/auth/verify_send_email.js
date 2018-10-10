const settings = require('../../../../settings');
var _ = require('lodash');
var Q = require('q');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const EmployerProfile = require('../../../../model/employer_profile');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const logger = require('../../../services/logger');

module.exports = function verify_send_email(info) {
    var deferred = Q.defer()
    var name;
    users.findOne({ email :info.email  }, function (err, result)
    {
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(result)
        {
            if(result.type== 'candidate')
            {

                CandidateProfile.find({_creator : result._id}).populate('_creator').exec(function(err, query_data)
                {

                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if(query_data)
                    {

                        if(!query_data[0].first_name)
                        {
                            name = info.email;

                        }
                        else
                        {
                            name = query_data[0].first_name;

                        }
                        verifyEmailEmail.sendEmail(info, name);

                    }
                    else
                    {
                        name = info.email;
                        verifyEmailEmail.sendEmail(info, name);
                    }

                });
            }
            else
            {

                EmployerProfile.find({_creator : result._id}).populate('_creator').exec(function(err, query_data)
                {

                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        deferred.reject(err.name + ': ' + err.message);
                    }
                    if(query_data)
                    {

                        if(query_data[0].first_name)
                        {
                            name = query_data[0].first_name;
                        }
                        else
                        {
                            name = info.email;

                        }
                        verifyEmailEmail.sendEmail(info, name);

                    }
                    else
                    {
                        name = info.email;
                        verifyEmailEmail.sendEmail(info, name);
                    }

                });
            }

        }
        else
        {
            deferred.resolve({error:'Email Not Found'});
        }

    });


}