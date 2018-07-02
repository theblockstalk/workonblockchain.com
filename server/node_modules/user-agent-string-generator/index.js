var userAgents = require('./userApents.json');

module.exports = function() {
    return userAgents[Math.floor(Math.random() * userAgents.length)];
}
