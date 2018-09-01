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

module.exports = function (req,res)
{
    admin_candidate_filter(req.body).then(function (err, data)
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

function admin_candidate_filter(data)
{
    var query_result = [];
    var company_rply = [];
    var deferred = Q.defer();
    //console.log(data);
    var arr = data.msg_tags;
    if(arr)
    {
        var picked = arr.find(o => o === 'is_company_reply');
        var employ_offer = arr.find(o => o === 'Employment offer accepted / reject');
        if(employ_offer)
        {
            var offered = ['job_offer_rejected', 'job_offer_accepted'];
            //data.msg_tags = ['job_offer_rejected', 'job_offer_accepted'];
            offered.forEach(function(item)
            {
                data.msg_tags.push(item );
            });
        }

    }
    if(picked)
    {
        company_rply= [1,0];
    }
    //console.log(company_rply);
    //console.log(data.msg_tags);
    if(data.is_approve!== -1 && data.msg_tags )
    {
        console.log("both true");
        //console.log(data.msg_tags);
        users.find({type : 'candidate' , is_approved :data.is_approve }, function (err, dataa)
        {
            //console.log(dataa);
            if(err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if(dataa)
            {
                var array2 = [];
                dataa.forEach(function(item)
                {
                    array2.push(item._id );
                });
                //console.log(array2);
                CandidateProfile.find({"_creator" : {$in : array2}} ).populate('_creator').exec(function(err, result)
                {
                    //console.log(result);
                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result)
                    {
                        result.forEach(function(item)
                        {
                            query_result.push(item );
                        });

                        chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data)
                        {
                            if(err)
                                deferred.reject(err.name + ': ' + err.message);
                            if(data)
                            {
                                //console.log(data);
                                var array = [];
                                data.forEach(function(item)
                                {
                                    array.push(item.receiver_id );
                                });

                                CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result2)
                                {
                                    //console.log(result);
                                    if (err){
                                        logger.error(err.message, {stack: err.stack});
                                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                                    }
                                    if (result2 == '' && dataa == '')
                                    {
                                        deferred.reject("Not Found Any Data");

                                    }

                                    else
                                    {
                                        result2.forEach(function(item)
                                        {
                                            query_result.push(item );
                                        });
                                        //console.log(query_result.length);
                                        // var non_duplidated_data = array_unique($query_result, SORT_REGULAR);

                                        // var non_duplidated_data = _.uniq(query_result, '_id');

                                        deferred.resolve(query_result);
                                    }
                                });

                                //deferred.resolve(data);
                            }

                        });

                    }
                    else
                    {
                        deferred.resolve(result)
                    }
                });

            }

            //console.log(data);
        });

    }


    else if(data.is_approve!== -1)
    {
        console.log("is_approve");
        users.find({type : 'candidate' , is_approved :data.is_approve }, function (err, data)
        {
            if(err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if(data=='')
            {
                deferred.reject("Not Found Any Data");
                //console.log(data);
            }
            else
            {
                var array = [];
                data.forEach(function(item)
                {
                    array.push(item._id );
                });
                //console.log(array);
                CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
                {
                    //console.log(result);
                    if (err){
                        logger.error(err.message, {stack: err.stack});
                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result == '')
                    {
                        deferred.reject("Not Found Any Data");

                    }
                    else
                    {
                        deferred.resolve(result)
                    }
                });

            }

        });
    }

    else if(data.msg_tags)
    {
        console.log("msg_tags");
        //console.log(data.msg_tags);
        chat.find({$or : [{msg_tag : {$in: data.msg_tags}} , {is_company_reply: {$in:company_rply} }]}, function (err, data)
        {
            if(err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            if(data)
            {
                //console.log(data);
                var array = [];
                data.forEach(function(item)
                {
                    array.push(item.receiver_id );
                });
                //console.log(array);

                CandidateProfile.find({"_creator" : {$in : array}} ).populate('_creator').exec(function(err, result)
                {
                    //console.log(result);
                    if (err) {
                        logger.error(err.message, {stack: err.stack});
                        //console.log(err);//deferred.reject(err.name + ': ' + err.message);
                    }
                    if (result == '')
                    {
                        deferred.reject("Not Found Any Data");

                    }
                    else
                    {
                        deferred.resolve(result)
                    }
                });
                //deferred.resolve(data);
            }
        });
    }
    return deferred.promise;
}