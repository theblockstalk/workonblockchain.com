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
    if(body.msg_tag === 'file') {
        const res = await
        chai.request(server)
            .post('/v2/messages')
            .set('Authorization', jwtToken)
            .field('receiver_id', body.receiver_id.toString())
            .field('msg_tag', body.msg_tag)
            .attach('photo', myFile, messageFile.name);
        return res;
    }
    else{
        const res = await
        chai.request(server)
            .post('/v2/messages')
            .set('Authorization', jwtToken)
            .field('receiver_id', body.receiver_id.toString())
            .field('description', body.message.employment_offer.description)
            .field('title', body.message.employment_offer.title)
            .field('salary', body.message.employment_offer.salary)
            .field('salary_currency', body.message.employment_offer.salary_currency)
            .field('start_date', body.message.employment_offer.start_date)
            .field('type', body.message.employment_offer.type)
            .field('msg_tag', body.msg_tag)
            .attach('photo', myFile, messageFile.name);
        return res;
    }
}

module.exports.get = async function (jwtToken) {
    const res = await chai.request(server)
        .get('/v2/messages')
        .set('Authorization', jwtToken)
        .send();
    return res;
}

module.exports.getConversations = async function (jwtToken) {
    const res = await chai.request(server)
        .get('/v2/conversations')
        .set('Authorization', jwtToken)
        .send();
    return res;
}

module.exports.patch = async function (sender_id,jwtToken) {
    const res = await chai.request(server)
        .patch('/v2/conversations/'+sender_id+'/messages')
        .set('Authorization', jwtToken)
        .send();
    return res;
}

module.exports.getmessages = async function (receiver_id,jwtToken) {
    const res = await chai.request(server)
        .get('/v2/conversations/'+receiver_id+'/messages')
        .set('Authorization', jwtToken)
        .send();
    return res;
}

module.exports.termsAndPrivacy = async function (inputQuery,user_id,jwtToken) {
    const res = await chai.request(server)
        .patch('/v2/users/')
        .set('Authorization', jwtToken)
        .send(inputQuery);
    return res;
}