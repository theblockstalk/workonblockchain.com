const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');

const should = chai.should();
chai.use(chaiHttp);

module.exports.getStatistics = async function getStatistics() {
    const res = await chai.request(server)
        .get('/v2/statistics')
        .send();
    res.should.have.status(200);
    return res;
}

const getMetrics = module.exports.getMetrics = async function getMetrics(admin,jwtToken) {
    const res = await chai.request(server)
        .get('/v2/statistics?admin='+admin)
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}