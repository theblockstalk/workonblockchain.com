const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const userHelpers = require('../../otherHelpers/usersHelpers');

const should = chai.should();
chai.use(chaiHttp);

const signupCandidate = module.exports.signupCandidate = async function (candidate) {
    return await chai.request(server)
        .post('/v2/users/candidates')
        .send(candidate);
}


module.exports.candidateProfile = async function candidateProfile(candidate, profileData) {
    const res = await signupCandidate(candidate);
    await userHelpers.verifyEmail(candidate.email);
    await candidateProfilePatch(res.body._id, res.body.jwt_token, profileData);
}


const candidateProfilePatch = module.exports.candidateProfilePatch = async function (user_id, jwt_token, inputQuery ) {
    console.log(inputQuery);
    const res = await chai.request(server)
        .patch('/v2/users/candidates?user_id='+ user_id)
        .set('Authorization', jwt_token)
        .send(inputQuery);
    res.should.have.status(200);
    return res;
}

const changeCandidateStatus = module.exports.changeCandidateStatus = async function (user_id,inputQuery,jwtToken) {

    const res = await chai.request(server)
        .post('/v2/users/candidates/history?admin='+true+ '&user_id='+user_id)
        .set('Authorization', jwtToken)
        .send(inputQuery);
    res.should.have.status(200);
    return res;
}

const getAll = module.exports.getAll = async function getAll(isAdmin,jwtToken) {
    const res = await chai.request(server)
        .post('/v2/users/candidates/search?admin='+isAdmin)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const candidateFilter = module.exports.candidateFilter = async function candidateFilter(isAdmin,filterData,jwtToken) {
    const res = await chai.request(server)
        .post('/v2/users/candidates/search?admin='+isAdmin)
        .set('Authorization', jwtToken)
        .send(filterData);
    res.should.have.status(200);
    return res;
}

const verifiedCandidate = module.exports.verifiedCandidate = async function verifiedCandidate(jwtToken){
    const res = await chai.request(server)
        .post('/v2/users/candidates/search')
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}

const companyFilter = module.exports.companyFilter = async function companyFilter(filterData,jwtToken){
    const res = await chai.request(server)
        .post('/v2/users/candidates/search')
        .set('Authorization', jwtToken)
        .send(filterData)
    return res;
}

const getVerifiedCandidateDetail = module.exports.getVerifiedCandidateDetail = async function getVerifiedCandidateDetail(userId,jwtToken){
    const res = await chai.request(server)
        .get('/v2/users/candidates?user_id='+userId)
        .set('Authorization', jwtToken);
    res.should.have.status(200);
    return res;
}