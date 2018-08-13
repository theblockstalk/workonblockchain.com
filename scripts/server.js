const aws = require('aws-sdk');
const config = require('./config');
const accessKey = require('./access/accessKey');
const scriptUtils = require('./utils');

aws.config.update({
    secretAccessKey: accessKey.secretAccessKey,
    accessKeyId: accessKey.accessKeyId,
    region: "eu-west-1"
});

(async function run() {
    console.log('deploying the backend to elastic beanstalk');
    await deployBackend();
    console.log("finished");
})();

const tempDirName = './' + config.tempDirs.temp;
const tempServerDirName = './' + config.tempDirs.temp + '/' + config.tempDirs.server + '/';
const appName = config.eb.appName;
const envName = config.eb.staging.envName;
const s3bucket = config.s3.bucketName;

const eb = new aws.ElasticBeanstalk();

async function deployBackend() {
    try {
        console.log('This script will deploy the latest in the /server directory to the backend application');
        console.log('Please make sure there is no files in the working directory (do a `git stash` if you are unsure)');

        await scriptUtils.pressEnterToContinue();

        console.log();
        console.log('(1/5) getting branch and commit info');
        const gitInfo = await scriptUtils.getGitCommit();
        console.log(gitInfo);

        if (gitInfo.branch !== 'staging') {
            // throw new Error('You can only deploy to the staging environment on the staging branch');
        }

        console.log();
        console.log('(2/5) creating distribution package from server/');
        // TODO: delete contents of tempServerDirName
        await scriptUtils.createTempServerDir(tempServerDirName);
        // TODO: add in some tags for application to serve the version commit
        const zipFileName = await scriptUtils.zipServerDir(tempDirName, tempServerDirName, gitInfo.commit);

        console.log(zipFileName);
        console.log('(3/5) uploading the environment version (distribution) to S3');
        let distributionS3File = await scriptUtils.uploadToS3(envName, s3bucket, zipFileName);
        console.log(distributionS3File);

        console.log();
        console.log('(4/5) creating a new application version');
        try {
            const ebVersion = await eb.createApplicationVersion({
                ApplicationName: appName,
                VersionLabel: zipFileName.name,
                SourceBundle: {
                    S3Bucket: s3bucket,
                    S3Key: distributionS3File.Key
                }
            }).promise();

            console.log(ebVersion);
        } catch(error) {
            if (error.message === 'Application Version ' + zipFileName.name + ' already exists.')
                console.log('Application version was already found for the elastic beanstalk application');
            else throw error;
        }

        console.log();
        console.log('(5/5) updating the elastic beanstalk environment');
        const ebUpdate = await eb.updateEnvironment({
            ApplicationName: appName,
            EnvironmentName: envName,
            OptionSettings: [{
                Namespace: 'aws:elasticbeanstalk:container:nodejs',
                OptionName: 'NodeCommand',
                Value: 'npm start'
            }],
            VersionLabel: zipFileName.name
        }).promise();
        console.log(ebUpdate);
    } catch(error) {
        console.log(error);
    }
}