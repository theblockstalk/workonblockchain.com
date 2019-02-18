const Users = require('../../../model/users');
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

module.exports.approve = async function approve(email) {
    await Users.update({email: email}, {$set: {is_approved: 1}});
}

module.exports.makeAdmin = async function makeAdmin(email) {
    await Users.update({email: email}, {$set: {is_admin: 1}});
}

module.exports.verifyEmail = async function verifyEmail(email) {
    await Users.update({email: email}, {$set: {is_verify: 1}});
}

module.exports.setStatus = async function setStatus(status, jwtToken) {
    const data = {
        'status' : status
    };
    const res = await chai.request(server)
        .post('/users/updatePopupStatus')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

module.exports.approveCandidate = async function approveCandidate(email) {
    let newStatus = {
        status: 'approved',
        status_updated: new Date(),
        timestamp: new Date()
    };
    await
    Users.update({email: email}, {
        $push: {
            'candidate.status': {
                $each: [newStatus],
                $position: 0
            }
        },
        'first_approved_date': new Date()
    });
}

module.exports.getStatistics = async function getStatistics() {
    const res = await chai.request(server)
        .get('/users/statistics')
        .send();
    res.should.have.status(200);
    return res;
}