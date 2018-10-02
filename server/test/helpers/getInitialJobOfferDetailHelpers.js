const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../server');
const Users = require('../../model/users');

chai.use(chaiHttp);


const getInitialJobOfferDetail = module.exports.getInitialJobOfferDetail = async function getInitialJobOfferDetail(sender_id,recever_id,msg_tag,jwtToken) {
    const res = await chai.request(server)
        .post('/users/get_job_desc_msgs')
        .set('Authorization', jwtToken)
        .send(sender_id,recever_id,msg_tag);
    return res;
}