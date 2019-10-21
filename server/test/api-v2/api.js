const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');

chai.use(chaiHttp);

const apiRequest = async function (method, path, jwtToken, query, body) {
    let fullPath = path;
    if (query) path += "?";

    for (let key in query) {
        if (Object.prototype.hasOwnProperty.call(query, key)) {
            path += key + "=" + query[key] + "&"
        }
    }
    return await chai.request(server)[method](fullPath).set('Authorization', jwtToken).send(body);
}

let api = {
    conversations: {},
    jobs: {}
};

api.jobs.POST = asnc function (jwtToken, query) {
    return apiRequest("post", "v2/jobs/", jwtToken, query, null)
}

api.jobs.PATCH = asnc function (jwtToken, query) {
    return apiRequest("patch", "v2/jobs/", jwtToken, query, null)
}

api.jobs.GET = asnc function (jwtToken, query) {
    return apiRequest("get", "v2/jobs/", jwtToken, query, null)
}

modules.export = api;