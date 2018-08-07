const settings = require('../../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../../model/users');
const CandidateProfile = require('../../../../model/candidate_profile');
const Pages = require('../../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../../../model/chat');

const forgotPasswordEmail = require('../../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../../services/email/emails/verifyEmail');
const referUserEmail = require('../../../services/email/emails/referUser');
const chatReminderEmail = require('../../../services/email/emails/chatReminder');
const referedUserEmail = require('../../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../../services/logger');

module.exports = function verify_send_email(info) {
    var deferred = Q.defer()
    //console.log(info.email);
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