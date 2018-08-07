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

module.exports = function (req,res)
{
    change_password(req.params.id , req.body).then(function (err, data)
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

function change_password(id , param)
{
    var deferred = Q.defer();

    //console.log(id);
    //console.log(token);
    users.findOne({_id :id }, function (err, user)
    {

        //console.log(user);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if (user && bcrypt.compareSync(param.current_password, user.password))
        {


            updatePassword(user._id);
        }
        else
        {
            deferred.reject("Current Password is Incorrect");
        }


    });

    function updatePassword(_id )
    {
        //console.log(_id);

        //console.log(user.password);
        var user = _.omit(param, 'password');
        var salt = bcrypt.genSaltSync(10);

        // add hashed password to user object
        user.password = bcrypt.hashSync(param.password, salt);

        var set =
            {
                password:user.password,
            };
        users.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set }, function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
            {

                deferred.resolve({msg:'Password changed successfully'});
            }
        });
    }

    return deferred.promise;
}