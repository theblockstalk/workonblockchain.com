const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const should = chai.should();

chai.use(chaiHttp);

const accountSetting = module.exports.accountSetting = async function (id, queryInput ,jwtToken){
    const res = await chai.request(server)
        .patch('/v2/users/'+ id)
        .set('Authorization', jwtToken)
        .send(queryInput)
    res.should.have.status(200);
    return res;
}




