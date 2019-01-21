const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');
const fs = require('fs');

chai.use(chaiHttp);

module.exports.post = async function (body, jwtToken) {
    const res = await chai.request(server)
        .post('/v2/messages')
        .set('Authorization', jwtToken)
        .send(body);
    return res;
}

module.exports.sendFile = async function (messageFile,body, jwtToken) {
    const myFile = fs.readFileSync(messageFile.path);
    console.log(messageFile);
    const res = await chai.request(server)
        .post('/v2/messages')
        .set('Authorization', jwtToken)
        .field('receiver_id',body.receiver_id.toString())
        .attach('photo', myFile, messageFile.name);
    return res;
}