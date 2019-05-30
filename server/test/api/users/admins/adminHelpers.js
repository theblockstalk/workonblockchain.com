const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../../server');
const should = chai.should();

chai.use(chaiHttp);

const getMetrics = module.exports.getMetrics = async function getMetrics(jwtToken) {
    const res = await chai.request(server)
        .get('/users/get_metrics')
        .set('Authorization', jwtToken)
        .send();
    res.should.have.status(200);
    return res;
}
