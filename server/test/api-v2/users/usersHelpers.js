const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const should = chai.should();

chai.use(chaiHttp);

const accountSetting = module.exports.accountSetting = async function (id, queryInput ,jwtToken){
    const res = await chai.request(server)
        .patch('/v2/users/settings')
        .set('Authorization', jwtToken)
        .send(queryInput)
    res.should.have.status(200);
    return res;
}

const verifyEmail = module.exports.verifyEmail = async function verifyEmail(verify_email_key) {
    const res = await chai.request(server)
        .patch('/v2/users/email?verify_email_token=' + verify_email_key)
        .send()
    res.should.have.status(200);
    return res;
}

const verifyClient = module.exports.verifyClient = async function (jwtToken,email){
    const res = await chai.request(server)
        .post('/v2/users/email?email='+ email)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}