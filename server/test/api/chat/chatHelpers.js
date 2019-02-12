const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

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