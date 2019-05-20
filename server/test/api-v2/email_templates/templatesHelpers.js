const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../api/users/usersHelpers');

const should = chai.should();
chai.use(chaiHttp);

const newEmailTemplate = module.exports.newEmailTemplate = async function newEmailTemplate(emailObj, jwtToken) {
    const res = await chai.request(server)
        .post('/v2/email_templates?admin=true')
        .set('Authorization', jwtToken)
        .send(emailObj);
    res.should.have.status(200);
    return res;
}

const updateEmailTemplate = module.exports.updateEmailTemplate = async function updateEmailTemplate(templateId, emailObj, jwtToken) {
    const res = await chai.request(server)
        .patch('/v2/email_templates?admin=true&template_id='+ templateId)
        .set('Authorization', jwtToken)
        .send(emailObj);
    res.should.have.status(200);
    return res;
}

const getEmailTemplate = module.exports.getEmailTemplate = async function getEmailTemplate(jwtToken) {
    const res = await chai.request(server)
        .get('/v2/email_templates/search?admin=true')
        .set('Authorization', jwtToken)
    res.should.have.status(200);
    return res;
}