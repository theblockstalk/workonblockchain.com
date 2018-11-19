const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const Users = require('../../../../../model/users');
const should = chai.should();

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
    res.should.have.status(404);
    return res;
}

const setUnreadMessageNotificationStatus = module.exports.setUnreadMessageNotificationStatus = async function setUnreadMessageNotificationStatus(userId,status,jwtToken) {
    const data = {
        'user_id': userId,
        'status': status
    };
    const res = await chai.request(server)
        .post('/users/set_unread_msgs_emails_status')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const setUnreadMessageStatus = module.exports.setUnreadMessageStatus = async function setUnreadMessageStatus(receiverId,senderId,status,jwtToken) {
    const data = {
        'receiver_id': receiverId,
        'sender_id': senderId,
        'status': status
    };
    const res = await chai.request(server)
        .post('/users/update_chat_msg_status')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}