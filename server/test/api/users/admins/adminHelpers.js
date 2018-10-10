const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const should = chai.should();

chai.use(chaiHttp);

const approveUser = module.exports.approveUser = async function approveUser(id,status,jwtToken) {
    const data = {
        'is_approve': status
    };
    const res = await chai.request(server)
        .put('/users/approve/'+id)
        .set('Authorization', jwtToken)
        .send(data);
    res.should.have.status(200);
    return res;
}

const companyFilter = module.exports.companyFilter = async function companyFilter(filterData,jwtToken) {
    const res = await chai.request(server)
        .post('/users/admin_company_filter')
        .set('Authorization', jwtToken)
        .send(filterData);
    res.should.have.status(200);
    return res;
}

const candidateFilter = module.exports.candidateFilter = async function candidateFilter(filterData,jwtToken) {
    const res = await chai.request(server)
        .post('/users/admin_candidate_filter')
        .set('Authorization', jwtToken)
        .send(filterData);
    res.should.have.status(200);
    return res;
}