const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../server');

chai.use(chaiHttp);

const apiRequest = async function (method, path, jwtToken, query, body) {
    let fullPath = path;
    if (query) path += "?";

    for (let key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
            fullPath += key + "=" + query[key] + "&"
        }
    }

    return await chai.request(server)[method](fullPath).set('Authorization', jwtToken).send(body);
}

let api = {
    conversations: {},
    jobs: {}
};

api.jobs.POST = async function (jwtToken, query, body) {
    return await apiRequest("post", "/v2/jobs", jwtToken, query, body)
}

api.jobs.PATCH = async function (jwtToken, query, body) {
    return await apiRequest("patch", "/v2/jobs", jwtToken, query, body)
}

api.jobs.GET = async function (jwtToken, query) {
    return await apiRequest("get", "/v2/jobs", jwtToken, query, null)
}

module.exports = api;