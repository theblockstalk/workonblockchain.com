const config = require('./config');
const scriptHelpers = require('./helpers');

const tempClientDirName = './temp/client/dist/';
let s3bucket;
let buildCommand;

(async function run() {
    try {
        const environmentName = process.argv[2];
        console.log('deploying the frontend to S3 bucket');
        if (environmentName === 'production') {
            s3bucket = config.s3.frontendBucket.production;
            buildCommand = 'npm run-script build-prod';
        } else if (environmentName === 'staging') {
            s3bucket = config.s3.frontendBucket.staging;
            buildCommand = 'npm run-script build-staging';
        } else {
            throw new Error("Need to provide argument for the environment: staging or production");
        }

        process.env.NODE_ENV = environmentName;

        await deployFrontend(environmentName);
        console.log("finished");
        console.log("you may have to wait up to an hour for the Cloudfront Distribution CDN caches to clear before you see the new application frontend");
    } catch(error) {
        console.log(error);
        process.exit(1);
    }
    process.exit(0);
})();

async function deployFrontend(environmentName) {
    console.log('This script will deploy the latest in the /client directory to the frontend application');
    console.log('Please make sure there is no files in the working directory (responsibly do a `git stash` if you are unsure)');

    console.log();
    console.log('(1/4) getting Git branch and commit info');
    const gitInfo = await scriptHelpers.getGitCommit();
    console.log(gitInfo);

    scriptHelpers.checkGitBranch(gitInfo.branch, environmentName);

    console.log();
    console.log('(2/4) building distribution in client/dist/');
    await scriptHelpers.buildAngularDistribution(buildCommand);

    console.log();
    console.log('(3/4) moving to temporary directory temp/client/dist');
    await scriptHelpers.createTempClientDir(tempClientDirName, environmentName === 'production');
    const versonName = 'client_' + gitInfo.commit + '_' + environmentName;
    await scriptHelpers.addVersionFile(tempClientDirName + 'version', versonName);

    console.log();
    console.log('(4/4) syncing to S3 bucket');
    await scriptHelpers.syncDirwithS3(s3bucket, tempClientDirName);
}