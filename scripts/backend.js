const aws = require('aws-sdk');
const accessKey = require('./access/accessKey');
const fs = require('fs');
const ncp = require('ncp').ncp;
const gitRev = require('git-rev')

ncp.limit = 16;

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

const config = {
    "staging": {
        "eb": {
            "appName": "workonblockchain.com",
            "envName": "staging-api-workonblockchain-com-env"
        },
        "s3": {
            "bucketName": "distributions.workonblockchain.com"
        }
    }
};

async function deployBackend() {
    try {
        const s3 = new aws.S3();
        const eb = new aws.ElasticBeanstalk();

        const appName = 'workonblockchain.com';
        const envName = 'testing-api-workonblockchain-com-env';
        const s3bucket = 'distributions.workonblockchain.com';

        // console.log();
        // console.log('(1/5) getting branch and commit info');
        // const commitHead = await new Promise((resolve, reject) => {
        //     gitRev.short( (hash) => {
        //         resolve(hash);
        //     });
        // });
        // // gitRev.short(function (str) {
        // //     console.log('short', str)
        // //     // => aefdd94
        // // })
        // console.log(commitHead);
        // return;


        console.log();
        console.log('(1/5) creating distribution package from server/');
        const options = {
            // Do not copy the node_modules folder
            filter: /^((?!node_modules).)*$/
        };
        await new Promise((resolve, reject) => {
            ncp('./server', './temp/server', options, function (err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });

        fs.unlinkSync('./temp/server/config/production.json');
        return;
        // zip into file
        // filename is that of git hash

        const zipFileName = 'server_0f46ec';
        const zipFilePath = 'temp/server/';
        const zipFile = zipFilePath + zipFileName + '.zip';

        console.log();
        console.log('(2/5) uploading the environment version (distribution) to S3');
        const s3Key = appName + '_' + envName + '_' + zipFileName;

        let s3Object = await s3.upload({
            Bucket: s3bucket,
            Key: s3Key,
            Body: fs.createReadStream(zipFile)
        }).promise();
        console.log(s3Object);

        console.log();
        console.log('(3/5) creating a new application version');
        const ebVersion = await eb.createApplicationVersion({
            ApplicationName: appName,
            VersionLabel: zipFileName,
            SourceBundle: {
                S3Bucket: s3bucket,
                S3Key: s3Key
            }
        }).promise();
        console.log(ebVersion);

        console.log();
        console.log('(4/5) updating the elastic beanstalk environment');
        const ebUpdate = await eb.updateEnvironment({
            ApplicationName: appName,
            EnvironmentName: envName,
            OptionSettings: [{
                Namespace: 'aws:elasticbeanstalk:container:nodejs',
                OptionName: 'NodeCommand',
                Value: 'npm start'
            }],
            VersionLabel: zipFileName
        }).promise();
        console.log(ebUpdate);

    } catch(error) {
        console.log(error);
    }
}