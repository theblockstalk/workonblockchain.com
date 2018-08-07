const settings = require('../../../settings');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var date = require('date-and-time');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
const users = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const Pages = require('../../../model/pages_content');
var crypto = require('crypto');
var jwt_hash = require('jwt-simple');
const EmployerProfile = require('../../../model/employer_profile');
var md5 = require('md5');
const chat = require('../../../model/chat');

const forgotPasswordEmail = require('../../services/email/emails/forgotPassword');
const verifyEmailEmail = require('../../services/email/emails/verifyEmail');
const referUserEmail = require('../../services/email/emails/referUser');
const chatReminderEmail = require('../../services/email/emails/chatReminder');
const referedUserEmail = require('../../services/email/emails/referredFriend');

const USD = settings.CURRENCY_RATES.USD;
const GBP = settings.CURRENCY_RATES.GBP;
const Euro = settings.CURRENCY_RATES.Euro;
const emails = settings.COMPANY_EMAIL_BLACKLIST;
const logger = require('../../services/logger');

//////////inserting message in DB ////////////

module.exports = function (req,res)
{
    add_privacy_content(req.body).then(function (err, data)
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

function add_privacy_content(info)
{
    var deferred = Q.defer();
    var createdDate;
    let now = new Date();
    createdDate= date.format(now, 'DD/MM/YYYY');
    //console.log(info.page_title);
    Pages.findOne({ page_name: info.page_name}, function (err, data)
    {
        //console.log(data);
        if (err){
            logger.error(err.message, {stack: err.stack});
            deferred.reject(err.name + ': ' + err.message);
        }
        if(data==null)
        {
            //console.log("if");
            insertContent();

        }

        else
        {
            //console.log("else");
            updateContent(data._id);
        }

    });

    function updateContent(_id)
    {
        //console.log("update");
        var set =
            {
                page_content : info.html_text,
                page_title : info.page_title,
                updated_date:createdDate,
            };

        Pages.update({ _id: mongo.helper.toObjectID(_id) },{ $set: set },function (err, doc)
        {
            if (err){
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                deferred.resolve(set);
        });
    }

    function insertContent()
    {
        //console.log("insert");
        let add_content = new Pages
        ({
            page_title : info.page_title,
            page_content : info.html_text,
            page_name : info.page_name,
            updated_date:createdDate,

        });

        add_content.save((err,data)=>
        {
            if(err)
            {
                logger.error(err.message, {stack: err.stack});
                deferred.reject(err.name + ': ' + err.message);
            }
            else
                {

                    deferred.resolve
                ({
                    information :data
                });
    }
    });

    }

    return deferred.promise;

}