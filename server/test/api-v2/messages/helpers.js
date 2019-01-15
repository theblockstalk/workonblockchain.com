const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

module.exports.post = async function (body, jwtToken) {
    const res = await chai.request(server)
        .post('/v2/messages')
        .set('Authorization', jwtToken)
        .send(body);
    return res;
}