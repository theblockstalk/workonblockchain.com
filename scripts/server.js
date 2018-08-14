const config = require('./config');
const scriptUtils = require('./utils');

(async function run() {
    console.log('deploying the backend to elastic beanstalk');
    await deployBackend();
    console.log("finished");
})();

const tempDirName = './temp';
const tempServerDirName = './temp/server/';
const appName = config.eb.appName;
const envName = config.eb.envName.staging;
const s3bucket = config.s3.distributionsBucket;

async function deployBackend() {
    console.log('This script will deploy the latest in the /server directory to the backend application');
    console.log('Please make sure there is no files in the working directory (responsibly do a `git stash` if you are unsure)');

    await scriptUtils.pressEnterToContinue();

    console.log();
    console.log('(1/5) getting Git branch and commit info');
    const gitInfo = await scriptUtils.getGitCommit();
    console.log(gitInfo);

    scriptUtils.checkGitBranch(gitInfo.branch, 'staging');

    console.log();
    console.log('(2/5) creating distribution package from server/');
    await scriptUtils.createTempServerDir(tempServerDirName);
    // TODO: add in some tags for application to serve the version commit
    const zipFileName = await scriptUtils.zipServerDir(tempDirName, tempServerDirName, gitInfo.commit);

    console.log(zipFileName);
    console.log('(3/5) uploading the environment version (distribution) to S3');
    await scriptUtils.pressEnterToContinue();
    let distributionS3File = await scriptUtils.uploadZipfileToS3(envName, s3bucket, zipFileName);
    console.log(distributionS3File);

    console.log();
    console.log('(4/5) creating a new application version');
    await scriptUtils.pressEnterToContinue();
    await scriptUtils.addElasticEnvironmentVersion(s3bucket, appName, zipFileName, distributionS3File);

    console.log();
    console.log('(5/5) updating the elastic beanstalk environment');
    await scriptUtils.pressEnterToContinue();
    const ebUpdate = await scriptUtils.updateElisticEnvironment(appName, envName, zipFileName);
    console.log(ebUpdate);
}