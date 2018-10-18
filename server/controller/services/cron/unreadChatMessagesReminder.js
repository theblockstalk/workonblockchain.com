const settings = require('../../../settings');
var Q = require('q');
const users = require('../../../model/users');
const CandidateProfile = require('../../../model/candidate_profile');
const EmployerProfile = require('../../../model/employer_profile');
const chat = require('../../../model/chat');

const chatReminderEmail = require('../email/emails/chatReminder');
const logger = require('../logger');

module.exports = function (){
    try {
        get_unread_msgs().then((res, error) => {
            if (error) {
                logger.error(error.message, {stack: error.stack});
            }
        });
        
    } catch(error) {
        logger.error(error.message, {stack: error.stack});
    }
    logger.info('Unread chat messages email script was executed', {timestamp: Date.now()});
}

function get_unread_msgs(){
    var deferred = Q.defer();
    if (settings.isLiveApplication()) {
        logger.debug('get all unread msgs');
        //chat.aggregate({$group : {"receiver_id" : "$by_user", num_tutorial : {$sum : 1}}}, function (err, result){
        chat.distinct("receiver_id", {is_read: 0}, function (err, result){
            if (err){
                deferred.reject(err.name + ': ' + err.message);
            }
            else{
                for(var i=0;i<result.length;i++){
                    //console.log(result[i]);
                    users.findOne({ _id: result[i],is_unread_msgs_to_send: true,disable_account: false},{"email":1,"type":1}, function (err, newResult){
                        if(newResult){
							if(newResult.type === 'candidate'){
                                CandidateProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
                                    if (err){
                                        logger.error(err.message, {stack: err.stack});
                                        deferred.reject(err.name + ': ' + err.message);
                                    }
                                    if(query_data){
                                        chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
                                    }
                                });
                            }
                            else{
                                EmployerProfile.find({ _creator: newResult._id},{"first_name":1}, function (err, query_data){
                                    if (err){
                                        logger.error(err.message, {stack: err.stack});
                                        deferred.reject(err.name + ': ' + err.message);
                                    }
                                    if(query_data){
                                        chatReminderEmail.sendEmail(newResult.email,query_data[0].first_name);
                                    }
                                });
                            }
                        }
						else{
							logger.debug("nothing to do");
						}
                    });
                }
                deferred.resolve(result);
            }
        });
        return deferred.promise;
    }
    logger.debug("I ran the script!");
    return deferred.promise;
}