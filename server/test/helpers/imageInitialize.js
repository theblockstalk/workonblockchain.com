const makeDir = require('make-dir')

module.exports.initialize = async function initialize() {
    await makeDir('uploads');
}