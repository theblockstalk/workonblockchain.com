const messages = require('../model/mongoose/messages');
const Chat = require('../model/chat');
const logger = require('../controller/services/logger');
const users = require('../model/mongoose/users');

let totalDocsToProcess, totalProcessed = 0, totalModified = 0;

function isValidValue(val) {
    if (val && val !== null && val !== "" && val !== -1) return true;
    return false;
}

// This function will perform the migration
module.exports.up = async function() {
    totalDocsToProcess = await Chat.find({}).countDocuments();
    logger.debug(totalDocsToProcess);

    const chatCursor = await Chat.find({}).cursor();
    let chatDoc = await chatCursor.next();

    for ( null ; chatDoc !== null; chatDoc = await chatCursor.next()) {
        totalProcessed++;
        logger.debug("(" + totalProcessed + "/" + totalDocsToProcess + ") Migrating chat doc: " + chatDoc._id.toString());
        let newMessageDoc, oldMessage;
        if ( isValidValue(chatDoc.message) ) {
            oldMessage = chatDoc.message.toString();
            oldMessage = oldMessage.replace(/["']/g, "");
        }

        newMessageDoc = {
            _id: chatDoc._id,
            sender_id: chatDoc.sender_id,
            receiver_id: chatDoc.receiver_id,
            msg_tag: chatDoc.msg_tag,
            date_created: chatDoc.date_created,
        };
        if(chatDoc.job_type) {
            if (chatDoc.job_type === 'Part Time') chatDoc.job_type = 'Part time';
            if (chatDoc.job_type === 'Full Time') chatDoc.job_type = 'Full time';
        }

        if(chatDoc.msg_tag === 'job_offer'){
            newMessageDoc.message = {
                job_offer:{
                    title: chatDoc.job_title,
                    salary: chatDoc.salary,
                    salary_currency: chatDoc.salary_currency,
                    type: chatDoc.job_type,
                    location: chatDoc.interview_location,
                    description: chatDoc.description
                }
            };
        }
        else if(chatDoc.msg_tag === 'job_offer_accepted'){
            newMessageDoc.message = {
                job_offer_accepted:{
                    message: oldMessage
                }
            };
        }
        else if(chatDoc.msg_tag === 'job_offer_rejected'){
            newMessageDoc.message = {
                job_offer_rejected:{
                    message: oldMessage
                }
            };
        }
        else if(chatDoc.msg_tag === 'interview_offer'){
            newMessageDoc.message = {
                interview_offer:{
                    location: chatDoc.interview_location,
                    date_time: chatDoc.interview_date_time
                }
            };

            if( isValidValue(chatDoc.description) ){
                newMessageDoc.message.interview_offer.description = chatDoc.description;
            }
        }
        else if(chatDoc.msg_tag === 'employment_offer'){
            newMessageDoc.message = {
                employment_offer:{
                    title: chatDoc.job_title,
                    salary: chatDoc.salary,
                    salary_currency: chatDoc.salary_currency,
                    type: chatDoc.job_type,
                    start_date: chatDoc.date_of_joining,
                    description: chatDoc.description,
                }
            };

            if( isValidValue(chatDoc.file_name) ){
                newMessageDoc.message.employment_offer.file_url = chatDoc.file_name;
            }

        }
        else if(chatDoc.msg_tag === 'employment_offer_accepted'){
            newMessageDoc.message = {
                employment_offer_rejected:{
                    employment_offer_message_id: chatDoc.employment_offer_reference,
                    message: oldMessage
                }
            };
        }
        else{
            if(chatDoc.msg_tag === 'normal' && isValidValue(chatDoc.file_name) ){
                newMessageDoc.message = {
                    file:{
                        url: chatDoc.file_name
                    }
                };
            }
            else{
                newMessageDoc.message = {
                    normal:{
                        message: oldMessage
                    }
                };
            }
        }
        if (newMessageDoc) {
            let senderConv, senderSelect, senderUpdate;
            const timestamp = Date.now();

            const userDoc = await users.findOneById(chatDoc.sender_id);
            if (userDoc.conversations && userDoc.conversations.length>0) {
                const conversations = userDoc.conversations;
                senderConv = conversations.filter(item => String(item.user_id) ===  String(chatDoc.receiver_id));
                if (senderConv && senderConv.length > 0) {
                    let count = senderConv[0].count + 1;
                    senderSelect = { '_id': chatDoc.sender_id, 'conversations._id': senderConv[0]._id };
                    senderUpdate = { $set: {
                        'conversations.$.user_id': chatDoc.receiver_id,
                        'conversations.$.count': count,
                        'conversations.$.unread_count': 0,
                        'conversations.$.last_message': timestamp
                    }}
                }
                else{
                    senderSelect = { '_id': chatDoc.sender_id }
                    senderUpdate = { $push: { conversations: {
                        user_id: chatDoc.receiver_id,
                        count: 1,
                        unread_count: 0,
                        last_message: timestamp
                    }}}
                }
            }
            else{
                senderSelect = { '_id': chatDoc.sender_id }
                senderUpdate = { $push: { conversations: {
                    user_id: chatDoc.receiver_id,
                    count: 1,
                    unread_count: 0,
                    last_message: timestamp
                }}}
            }

            let receiverConv, receiverSelect, receiverUpdate;
            const receiverUserDoc = await users.findOneById(chatDoc.receiver_id);
            if (receiverUserDoc.conversations && receiverUserDoc.conversations.length>0) {
                const conversations = receiverUserDoc.conversations;
                receiverConv = conversations.filter(item => String(item.user_id) === String(chatDoc.sender_id));
                if (receiverConv && receiverConv.length>0) {
                    let count = receiverConv[0].count + 1;
                    let unread_count = 0;
                    if(chatDoc.is_read === 0){
                        unread_count = receiverConv[0].unread_count + 1;
                    }
                    receiverSelect = {'_id': chatDoc.receiver_id, 'conversations._id': receiverConv[0]._id};
                    receiverUpdate = {
                        $set: {
                            'conversations.$.user_id': chatDoc.sender_id,
                            'conversations.$.count': count,
                            'conversations.$.unread_count': unread_count,
                            'conversations.$.last_message': timestamp
                        }
                    }
                }
                else {
                    let unread_count = 0;
                    if(chatDoc.is_read === 0){
                        unread_count = 1;
                    }
                    receiverSelect = { '_id': chatDoc.receiver_id }
                    receiverUpdate = { $push: { conversations: {
                        user_id: chatDoc.sender_id,
                        count: 1,
                        unread_count: unread_count,
                        last_message: timestamp
                    }}}
                }
            }
            else{
                let unread_count = 0;
                if(chatDoc.is_read === 0){
                    unread_count = 1;
                }
                receiverSelect = { '_id': chatDoc.receiver_id }
                receiverUpdate = { $push: { conversations: {
                    user_id: chatDoc.sender_id,
                    count: 1,
                    unread_count: unread_count,
                    last_message: timestamp
                }}}
            }

            logger.debug("message doc added", newMessageDoc);
            const newDocs = await messages.insert(newMessageDoc);
            await users.update(senderSelect, senderUpdate);
            await users.update(receiverSelect, receiverUpdate);
            if (newDocs) totalModified++;
        }
    }
}

// This function will undo the migration
module.exports.down = async function() {
    await messages.deleteOne({});
}