const serviceSync = require('../serviceSync');

module.exports = async function () {
    await serviceSync.pullFromQueue();
}