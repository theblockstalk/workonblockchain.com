const gitRev = require('git-rev')
const ncp = require('ncp').ncp;
const fs = require('fs');

ncp.limit = 16;

module.exports.pressEnterToContinue = async function pressEnterToContinue() {
    return new Promise((resolve, reject) => {
        console.log();
        console.log('Press enter/return key to continue, or Ctr+C to exit.');
        process.stdin.once('data', function () {
            resolve();
        });
    });
};

module.exports.getGitCommit = async function getGitCommit() {
    const commitHead = await new Promise((resolve, reject) => {
        gitRev.short( (hash) => {
            resolve(hash);
        });
    });

    const branch = await new Promise((resolve, reject) => {
        gitRev.branch(function (name) {
            resolve(name);
        })
    })

    return {
        branch: branch,
        commit: commitHead
    }
};

module.exports.createTempServerDir = async function createTempServerDir(tempServerDirName) {
    const options = {
        // Do not copy the node_modules folder
        filter: /^((?!node_modules).)*$/
    };

    console.log(tempServerDirName);

    await new Promise((resolve, reject) => {
        ncp('./server', tempServerDirName, options, function (err) {
            if (err) {
                reject(err);
            }
            resolve();
        });
    });

    fs.unlinkSync(tempServerDirName + 'config/production.json');
}