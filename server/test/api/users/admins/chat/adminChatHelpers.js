const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');

chai.use(chaiHttp);

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