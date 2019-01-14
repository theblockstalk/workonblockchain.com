const Messages = require('../model/messages');
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
        logger.debug("(" + totalProcessed + "/" + totalDocsToProcess + ") Migrating chat doc: " + chatDoc._id.toString());
        let oldMessage,newMessages;
        if(chatDoc.msg_tag === 'job_offer'){
            newMessages = new Messages({
                _id: chatDoc._id,
                sender_id: chatDoc.sender_id,
                receiver_id: chatDoc.receiver_id,
                msg_tag: chatDoc.msg_tag,
                is_read: chatDoc.is_read,
                date_created: chatDoc.date_created,
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
            });
        }
        else if(chatDoc.msg_tag === 'job_offer_accepted'){
            oldMessage = chatDoc.message.toString();
            oldMessage = oldMessage.replace(/["']/g, "");
            newMessages = new Messages({
                _id: chatDoc._id,
                sender_id: chatDoc.sender_id,
                receiver_id: chatDoc.receiver_id,
                msg_tag: chatDoc.msg_tag,
                is_read: chatDoc.is_read,
                date_created: chatDoc.date_created,
                message : {
                    job_offer_accepted:{
                        message: oldMessage
                    }
                }
            });
        }
        else if(chatDoc.msg_tag === 'job_offer_rejected'){
            oldMessage = chatDoc.message.toString();
            oldMessage = oldMessage.replace(/["']/g, "");
            newMessages = new Messages({
                _id: chatDoc._id,
                sender_id: chatDoc.sender_id,
                receiver_id: chatDoc.receiver_id,
                msg_tag: chatDoc.msg_tag,
                is_read: chatDoc.is_read,
                date_created: chatDoc.date_created,
                message : {
                    job_offer_rejected:{
                        message: oldMessage
                    }
                }
            });
        }
        else if(chatDoc.msg_tag === 'interview_offer'){
            if(chatDoc.description){
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
                    message : {
                        interview_offer:{
                            location: chatDoc.interview_location,
                            description: chatDoc.description,
                            date_time: chatDoc.interview_date_time
                        }
                    }
                });
            }
            else{
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
                    message : {
                        interview_offer:{
                            location: chatDoc.interview_location,
                            date_time: chatDoc.interview_date_time
                        }
                    }
                });
            }
        }
        else if(chatDoc.msg_tag === 'employment_offer'){
            if(chatDoc.file_name){
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
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
                });
            }
            else{
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
                    message : {
                        employment_offer:{
                            title: chatDoc.job_title,
                            salary: chatDoc.salary,
                            salary_currency: chatDoc.salary_currency,
                            type: chatDoc.job_type,
                            start_date: chatDoc.date_of_joining,
                            description: chatDoc.description
                        }
                    }
                });
            }

        }
        else if(chatDoc.msg_tag === 'employment_offer_accepted'){
            oldMessage = chatDoc.message.toString();
            oldMessage = oldMessage.replace(/["']/g, "");
            newMessages = new Messages({
                _id: chatDoc._id,
                sender_id: chatDoc.sender_id,
                receiver_id: chatDoc.receiver_id,
                msg_tag: chatDoc.msg_tag,
                is_read: chatDoc.is_read,
                date_created: chatDoc.date_created,
                message : {
                    employment_offer_accepted:{
                        employment_offer_message_id: chatDoc.employment_offer_reference,
                        message: oldMessage
                    }
                }
            });
        }
        else if(chatDoc.msg_tag === 'employment_offer_rejected'){
            oldMessage = chatDoc.message.toString();
            oldMessage = oldMessage.replace(/["']/g, "");
            newMessages = new Messages({
                _id: chatDoc._id,
                sender_id: chatDoc.sender_id,
                receiver_id: chatDoc.receiver_id,
                msg_tag: chatDoc.msg_tag,
                is_read: chatDoc.is_read,
                date_created: chatDoc.date_created,
                message : {
                    employment_offer_rejected:{
                        employment_offer_message_id: chatDoc.employment_offer_reference,
                        message: oldMessage
                    }
                }
            });
        }
        else{
            if(chatDoc.msg_tag === 'normal' && chatDoc.file_name){
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
                    message : {
                        file:{
                            url: chatDoc.file_name
                        }
                    }
                });
            }
            else{
                oldMessage = chatDoc.message.toString();
                oldMessage = oldMessage.replace(/["']/g, "");
                newMessages = new Messages({
                    _id: chatDoc._id,
                    sender_id: chatDoc.sender_id,
                    receiver_id: chatDoc.receiver_id,
                    msg_tag: chatDoc.msg_tag,
                    is_read: chatDoc.is_read,
                    date_created: chatDoc.date_created,
                    message : {
                        normal:{
                            message: oldMessage
                        }
                    }
                });
            }
        }
        if (newMessages) {
            //unSet = {employment_offer_reference:1,file_name:1,is_job_offered:1,job_title: 1,salary:1,salary_currency:1,job_type:1,interview_location:1,interview_date_time:1,description:1,date_of_joining:1,sender_name: 1, receiver_name: 1,is_company_reply:1};
            //updateObj["$unset"] = unSet;
            logger.debug("message doc added", newMessages);
            const newDocs = await newMessages.save();
            //const update = await Messages.update({_id: chatDoc._id}, updateObj);
            if (newDocs) totalModified++;
        }
    }
}

// This function will undo the migration
module.exports.down = async function() {
    //BasicDBObject document = new BasicDBObject();
    //collection.deleteMany(document);
    //let newMessages = new Messages({});
    await Messages.find({}).remove();
}