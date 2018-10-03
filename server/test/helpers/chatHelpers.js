const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Users = require('../../model/users');

chai.use(chaiHttp);

const getInitialJobOfferDetail = module.exports.getInitialJobOfferDetail = async function getInitialJobOfferDetail(senderId,receverId,msgTag,jwtToken) {
   const data = {
        'sender_id': senderId,
        'receiver_id': receverId,
        'msg_tag': msgTag
    };
    const res = await chai.request(server)
        .post('/users/get_job_desc_msgs')
        .set('Authorization', jwtToken)
        .send(data);
    return res;
}

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
    return res;
}