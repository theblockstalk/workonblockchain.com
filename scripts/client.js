const config = require('./config');
const scriptUtils = require('./utils');

(async function run() {
    console.log('deploying the frontend to S3 bucket');
    await deployFrontend();
    console.log("finished");
    console.log("you may have to wait up to an hour for the Cloudfront Distribution CDN caches to clear before you see the new application frontend");
})();

const tempClientDirName = './temp/client/dist';
const s3bucket = config.s3.frontendBucket.staging;

async function deployFrontend() {
    console.log('This script will deploy the latest in the /client directory to the frontend application');
    console.log('Please make sure there is no files in the working directory (responsibly do a `git stash` if you are unsure)');

    await scriptUtils.pressEnterToContinue();

    console.log();
    console.log('(1/4) getting branch and commit info');
    const gitInfo = await scriptUtils.getGitCommit();
    console.log(gitInfo);

    if (gitInfo.branch !== 'staging') {
        // throw new Error('You can only deploy to the staging environment on the staging branch');
    }

    console.log();
    console.log('(2/4) building distribution in client/dist/');
    await scriptUtils.pressEnterToContinue();
    // TODO: add in some tags for application to serve the version commit
    await scriptUtils.buildAngularDistribution();

    console.log();
    console.log('(3/4) moving to temporary directory temp/client/dist');
    await scriptUtils.createTempClientDir(tempClientDirName);

    console.log();
    console.log('(4/4) syncing to S3 bucket');
    await scriptUtils.pressEnterToContinue();
    await scriptUtils.syncDirwithS3(s3bucket, tempClientDirName);


}