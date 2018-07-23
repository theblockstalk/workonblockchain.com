const healthCheck = require('./services/healthCheck.controller');
const users = require('./controller/users.controller');

module.exports.registerEndpoints = function (app) {
    app.use('/', healthCheck);
    app.use('/users', users);
}