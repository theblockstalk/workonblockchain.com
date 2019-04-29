const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../../api/users/usersHelpers');
chai.use(chaiHttp);

const signupCompany = module.exports.signupCompany = async function signupCompany(company) {
    const res = await chai.request(server)
        .post('/users/create_employer')
        .send(company);
    res.should.have.status(200);
    return res;
}

module.exports.signupVerifiedApprovedCompany = async function signupVerifiedApprovedCompany(company) {
    await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
    await userHelpers.approve(company.email);
}

module.exports.companyProfileData = async function companyProfileData(user_id, jwtToken, profiledata) {
    console.log(user_id);
    const res = await chai.request(server)
        .patch('/v2/users/'+user_id +'/companies')
        .set('Authorization', jwtToken)
        .send(profiledata);
    res.should.have.status(200);
    return res;
}

module.exports.approveUser = async function approveUser(user_id, params, jwtToken, admin) {
    console.log(user_id);
    const res = await chai.request(server)
        .post('/v2/users/'+user_id +'/companies/status?admin='+ admin)
        .set('Authorization', jwtToken)
        .send(params);
    res.should.have.status(200);
    return res;
}



