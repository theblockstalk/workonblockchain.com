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

const logger = require('../../../services/logger');
const filterReturnData = require('../filterReturnData');

module.exports = function (req,res)
    {
	
	//console.log(req.body);
        search_by_name(req.body.search).then(function (err, data)
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

function search_by_name(word)
{
    //, $options: 'i'
    var deferred = Q.defer();

    CandidateProfile.find(
        { $or : [  { first_name : {'$regex' : word, $options: 'i' } }, { last_name : {'$regex' : word , $options: 'i'} }]}
    ).populate('_creator').exec(function(err, result)
    {
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
        	var array=[];
       	 	result.forEach(function(item)
            {
                   array.push(filterReturnData.removeSensativeData(item.toObject()));
            });
       	 	deferred.resolve(array);
            //deferred.resolve(result)
        }
    });

    return deferred.promise;
}
