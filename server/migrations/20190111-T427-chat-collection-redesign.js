const Users = require('../model/users');
const Chat = require('../model/chat');
const logger = require('../controller/services/logger');


let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await Chat.find({}).countDocuments();
    logger.debug(totalDocsToProcess);

    const chatCursor = await Chat.find({}).cursor();
    let chatDoc = await chatCursor.next();

    for ( null ; chatDoc !== null; chatDoc = await chatCursor.next()) {
        totalProcessed++;
        //logger.debug("(" + totalProcessed + "/" + totalDocsToProcess + ") Migrating chat doc: " + chatDoc._id.toString());
        let updateObj,oldMessage,unSet;
        console.log(chatDoc.msg_tag);
        if(chatDoc.msg_tag === 'job_offer'){
            updateObj = {
                $set: {
                    message : {
                        job_offer:{
                            title: chatDoc.job_title,
                            salary: chatDoc.salary,
                            salary_currency: chatDoc.salary_currency,
                            type: chatDoc.job_type,
                            location: chatDoc.interview_location,
                            description: chatDoc.description
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'job_offer_accepted'){
            oldMessage = chatDoc.message.toString();
            updateObj = {
                $set: {
                    message : {
                        job_offer_accepted:{
                            message: oldMessage
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'job_offer_rejected'){
            oldMessage = chatDoc.message.toString();
            updateObj = {
                $set: {
                    message : {
                        job_offer_rejected:{
                            message: oldMessage
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'interview_offer'){
            updateObj = {
                $set: {
                    message : {
                        interview_offer:{
                            location: chatDoc.interview_location,
                            description: chatDoc.description,
                            date_time: chatDoc.interview_date_time
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'employment_offer'){
            updateObj = {
                $set: {
                    message : {
                        employment_offer:{
                            title: chatDoc.job_title,
                            salary: chatDoc.salary,
                            salary_currency: chatDoc.salary_currency,
                            type: chatDoc.job_type,
                            start_date: chatDoc.date_of_joining,
                            description: chatDoc.description,
                            file_url: chatDoc.file_name
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'employment_offer_accepted'){
            oldMessage = chatDoc.message.toString();
            updateObj = {
                $set: {
                    message : {
                        employment_offer_accepted:{
                            employment_offer_reference: chatDoc.employment_offer_reference,
                            message: oldMessage
                        }
                    }
                },
            };
        }
        else if(chatDoc.msg_tag === 'employment_offer_rejected'){
            oldMessage = chatDoc.message.toString();
            updateObj = {
                $set: {
                    message : {
                        employment_offer_rejected:{
                            employment_offer_reference: chatDoc.employment_offer_reference,
                            message: oldMessage
                        }
                    }
                },
            };
        }
        else{
            if(chatDoc.msg_tag === 'normal' && chatDoc.file_name){
                updateObj = {
                    $set: {
                        message : {
                            file:{
                                url: chatDoc.file_name.toString()
                            }
                        }
                    },
                };
            }
            else{
                oldMessage = chatDoc.message.toString();
                updateObj = {
                    $set: {
                        message : {
                            normal:{
                                message: oldMessage
                            }
                        }
                    },
                };
            }
        }
        if (updateObj) {
            unSet = {employment_offer_reference:1,file_name:1,is_job_offered:1,job_title: 1,salary:1,salary_currency:1,job_type:1,interview_location:1,interview_date_time:1,description:1,date_of_joining:1,sender_name: 1, receiver_name: 1,is_company_reply:1};
            updateObj["$unset"] = unSet;
            logger.debug("chat doc update", updateObj);
            const update = await Chat.update({_id: chatDoc._id}, updateObj);
            if (update && update.nModified) totalModified++;
        }
    }
}

// This function will undo the migration
module.exports.down = async function() {
    totalDocsToProcess = await Chat.find({}).count();
    logger.debug(totalDocsToProcess);
}