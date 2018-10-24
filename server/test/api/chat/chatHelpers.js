const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const Users = require('../../../model/users');
const should = chai.should();
const fs = require('fs');

chai.use(chaiHttp);

const insertMessage = module.exports.insertMessage = async function insertMessage(senderId,receverId,msgData,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId,
        'sender_name': msgData.sender_name,
        'receiver_name': msgData.receiver_name,
        'message': msgData.message,
        'description': msgData.description,
        'job_title': msgData.job_title,
        'salary': msgData.salary,
        'currency': msgData.currency,
        'date_of_joining': msgData.date_of_joining,
        'job_type': msgData.job_type,
        'msg_tag': msgData.msg_tag,
        'is_company_reply': msgData.is_company_reply,
        'interview_location': msgData.interview_location,
        'interview_time': msgData.interview_time
    };
    const res = await chai.request(server)
        .post('/users/insert_message')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const getUserInfo = module.exports.getUserInfo = async function getUserInfo(senderId,receverId,isCompanyReply,userType,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId,
        'is_company_reply': isCompanyReply,
        'type':userType
    };
    const res = await chai.request(server)
        .post('/users/get_candidate')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const getEmploymentOfferDetail = module.exports.getEmploymentOfferDetail = async function getEmploymentOfferDetail(senderId,receverId,msgTag,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId,
        'msg_tag': msgTag
    };
    const res = await chai.request(server)
        .post('/users/get_employ_offer')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;

}

const getMessages = module.exports.getMessages = async function getMessages(senderId,receverId,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId
    };
    const res = await chai.request(server)
        .post('/users/get_messages')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const getUnreadMessages = module.exports.getUnreadMessages = async function getUnreadMessages(senderId,receverId,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId
    };
    const res = await chai.request(server)
        .post('/users/get_unread_msgs_of_user')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const getUserMessages = module.exports.getUserMessages = async function getUserMessages(userId,jwtToken) {
    const data = {
        'id': userId
    };
    const res = await chai.request(server)
        .post('/users/get_user_messages')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const insertChatFile= module.exports.insertChatFile = async function insertChatFile(receverId,msgData,chatFile,jwtToken) {
    const myFile = fs.readFileSync(chatFile.path);
    const res = await chai.request(server)
        .post('/users/insert_chat_file')
        .set('Authorization', jwtToken)
        .field('receiver_id',receverId.toString())
        .field('sender_name',msgData.sender_name)
        .field('receiver_name',msgData.receiver_name)
        .field('message',chatFile.message)
        .field('description',msgData.description)
        .field('job_title',msgData.job_title)
        .field('salary',msgData.salary)
        .field('currency',msgData.currency)
        .field('date_of_joining',msgData.date_of_joining)
        .field('job_type',msgData.job_type)
        .field('msg_tag',msgData.msg_tag)
        .field('is_company_reply',msgData.is_company_reply)
        .field('interview_location',msgData.interview_location)
        .field('interview_time',msgData.interview_time)
        .field('file_name',chatFile.name)
        .attach('photo', myFile, chatFile.name);
    res.should.have.status(200);
    return res;
}

const sendEmploymentOffer = module.exports.sendEmploymentOffer = async function sendEmploymentOffer(senderId,receverId,msgData,offerData,jwtToken) {
    const data = {
        'sender_id': senderId,
        'receiver_id': receverId,
        'sender_name': msgData.sender_name,
        'receiver_name': msgData.receiver_name,
        'message': offerData.message,
        'description': offerData.description,
        'job_title': offerData.job_title,
        'salary': offerData.salary,
        'currency': offerData.currency,
        'date_of_joining': offerData.date_of_joining,
        'job_type': offerData.job_type,
        'msg_tag': offerData.msg_tag,
        'is_company_reply': msgData.is_company_reply,
        'interview_location': msgData.interview_location,
        'interview_time': msgData.interview_time
    };
    const res = await chai.request(server)
        .post('/users/insert_message_job')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const updateStatus = module.exports.updateStatus = async function updateStatus(candidateId,status,jwtToken) {
    const data = {
        'id': candidateId,
        'status': status
    };
    const res = await chai.request(server)
        .post('/users/update_is_company_reply_status')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const updateJobStatus = module.exports.updateJobStatus = async function updateJobStatus(chatId,status,jwtToken) {
    const data = {
        'id': chatId,
        'status': status
    };
    const res = await chai.request(server)
        .post('/users/update_job_message')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const uploadFile = module.exports.uploadFile = async function uploadFile(canddiateId,file,jwtToken) {
    const chatFile = fs.readFileSync(file.path);
    const res = await chai.request(server)
        .post('/users/upload_chat_file/'+canddiateId,file.name)
        .set('Authorization', jwtToken)
        .attach('photo', chatFile, file.name);
    res.status.should.equal(200);
    return res;

}

const getLastJobDescSent = module.exports.getLastJobDescSent = async function getLastJobDescSent(jwtToken) {
    const res = await chai.request(server)
        .post('/users/get_last_job_desc_msg')
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;

}