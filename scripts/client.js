const config = require('./config');
const scriptUtils = require('./utils');
const { exec, spawn } = require('child_process');

(async function run() {
    console.log('deploying the frontend to S3 bucket');
    await deployFrontend();
    console.log("finished");
    console.log("you may have to wait up to an hour for the Cloudfront Distribution CDN caches to clear before you see the new application frontend");
})();

const tempDirName = './temp';
const tempClientDirName = './temp/client/';
const s3bucket = config.s3.frontendBucket.staging;

async function deployFrontend() {
    console.log('This script will deploy the latest in the /client directory to the frontend application');
    console.log('Please make sure there is no files in the working directory (responsibly do a `git stash` if you are unsure)');

    await scriptUtils.pressEnterToContinue();

    console.log();
    console.log('(1/5) getting branch and commit info');
    const gitInfo = await scriptUtils.getGitCommit();
    console.log(gitInfo);

    if (gitInfo.branch !== 'staging') {
        // throw new Error('You can only deploy to the staging environment on the staging branch');
    }

    console.log();
    console.log('(2/5) building distribution in client/dist/');
    await new Promise((resolve, reject) => {
        exec('cd ./client && npm run-script build-staging', (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: `, stdout);
            console.log(`stderr: `, stderr);
            resolve();
        });
    });
    // TODO: delete contents of tempClientDirName
    await scriptUtils.createTempClientDir(tempClientDirName);
    // TODO: add in some tags for application to serve the version commit
}