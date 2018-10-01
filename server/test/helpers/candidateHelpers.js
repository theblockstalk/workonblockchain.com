const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Users = require('../../model/users');

chai.use(chaiHttp);


const signupCandidate = module.exports.signupCandidate = async function signupCandidate(candidate) {
    const res = await chai.request(server)
        .post('/users/register')
        .send(candidate);
    return res;
}

const signupAdminCandidate = module.exports.signupAdminCandidate = async function signupAdminCandidate(candidate) {
    await signupCandidate(candidate);
    await Users.update({email: candidate.email}, {$set: {is_admin: 1}});
}