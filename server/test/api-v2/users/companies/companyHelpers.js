const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../../api/users/usersHelpers');
chai.use(chaiHttp);

const signupCompany = module.exports.signupCompany = async function signupCompany(company) {
    const res = await chai.request(server)
        .post('/v2/users/companies')
        .send(company);
    res.should.have.status(200);
    return res;
}

module.exports.signupVerifiedApprovedCompany = async function signupVerifiedApprovedCompany(company) {
    await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
    await userHelpers.approve(company.email);
}


module.exports.signupAdminCompany = async function signupAdminCompany(company) {
    await signupCompany(company);
    await userHelpers.verifyEmail(company.email);
    await userHelpers.makeAdmin(company.email);
}

module.exports.companyProfileData = async function companyProfileData(user_id, jwtToken, profiledata) {
    console.log(user_id);
    const res = await chai.request(server)
        .patch('/v2/users/companies?user_id='+ user_id)
        .set('Authorization', jwtToken)
        .send(profiledata);
    res.should.have.status(200);
    return res;
}

module.exports.approveUser = async function approveUser(user_id, params, jwtToken, admin) {
    console.log(user_id);
    const res = await chai.request(server)
        .post('/v2/users/companies/status?admin='+true+'&user_id='+ user_id)
        .set('Authorization', jwtToken)
        .send(params);
    res.should.have.status(200);
    return res;
}

const getCurrentCompany = module.exports.getCurrentCompany = async function getCurrentCompany(companyId,jwtToken){
    const res = await chai.request(server)
        .get('/v2/users/companies?user_id=' + companyId)
        .set('Authorization', jwtToken)
    res.should.have.status(200);
    return res;
}

const getCompanies = module.exports.getCompanies = async function getCompanies(data,jwtToken){
    const res = await chai.request(server)
        .post('/v2/users/companies/search?admin=true')
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const companyFilter = module.exports.companyFilter = async function companyFilter(filterData,jwtToken) {
    const res = await chai.request(server)
        .post('/v2/users/companies/search?admin=true')
        .set('Authorization', jwtToken)
        .send(filterData);
    res.should.have.status(200);
    return res;
}