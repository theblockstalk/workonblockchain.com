const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../../api/users/usersHelpers');

const should = chai.should();
chai.use(chaiHttp);

const signupCandidate = module.exports.signupCandidate = async function signupCandidate(candidate) {
    const res = await chai.request(server)
        .post('/v2/users/candidates')
        .send(candidate);
    res.should.have.status(200);
    return res;
}


module.exports.candidateProfile = async function candidateProfile(candidate, profileData) {
    const res = await signupCandidate(candidate);
    await userHelpers.verifyEmail(candidate.email);
    await candidateProfilePatch(res.body._id, res.body.jwt_token, profileData);
}


const candidateProfilePatch = module.exports.candidateProfilePatch = async function candidateProfilePatch(user_id, jwt_token, inputQuery ) {
    const res = await chai.request(server)
        .patch('/v2/users/candidates?user_id='+ user_id)
        .set('Authorization', jwt_token)
        .send(inputQuery);
    res.should.have.status(200);
    return res;
}

const changeCandidateStatus = module.exports.changeCandidateStatus = async function changeCandidateStatus(user_id,inputQuery,jwtToken) {

    const res = await chai.request(server)
        .post('/v2/users/candidates/history?admin='+true+ '&user_id='+user_id)
        .set('Authorization', jwtToken)
        .send(inputQuery);
    res.should.have.status(200);
    return res;
}

const getAll = module.exports.getAll = async function getAll(isAdmin,jwtToken) {
    const res = await chai.request(server)
        .post('/v2/users/candidates/search?is_admin='+isAdmin)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}