const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Users = require('../../model/users');

chai.use(chaiHttp);


const signupcompany = module.exports.signupcompany = async function signupcompany(company) {
    const res = await chai.request(server)
        .post('/users/create_employer')
        .send(company);
    res.should.have.status(200);
    const userDocOld = await Users.findOne({email: company.email}).lean();

    const data = await chai.request(server)
        .put('/users/emailVerify/'+userDocOld.verify_email_key,'')
        .send();
    return data;
}

const signupAdmincompany = module.exports.signupAdmincompany = async function signupAdmincompany(company) {
    //await signupcompany(company);
    await Users.update({email: company.email}, {$set: {is_admin: 1}});
}