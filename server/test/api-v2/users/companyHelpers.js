const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

const signupCompany = module.exports.signupCompany = async function signupCompany(company) {
    const res = await chai.request(server)
        .post('/users/create_employer')
        .send(company);
    res.should.have.status(200);
    return res;
}

module.exports.companyProfileData = async function companyProfileData(user_id, jwtToken, profiledata) {

    const res = await chai.request(server)
        .patch('/v2/users/'+user_id +'/companies')
        .set('Authorization', jwtToken)
        .send(profiledata);
    res.should.have.status(200);
    return res;
}



