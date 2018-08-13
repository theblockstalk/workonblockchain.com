const aws = require('aws-sdk');
const accessKey = require('./access/accessKey');
const fs = require('fs');
const ncp = require('ncp').ncp;
const gitRev = require('git-rev')
const archiver = require('archiver');

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
    "eb": {
        "appName": "workonblockchain.com",
        "staging": {
            "envName": "testing-api-workonblockchain-com-env"
        },
        "production": {
            "envName": ""
        }
    },
    "s3": {
        "bucketName": "distributions.workonblockchain.com"
    },
    "tempDirs": {
        "temp": "temp",
        "server": "server"
    }
};

const tempDirName = './' + config.tempDirs.temp;
const tempServerDirName = './' + config.tempDirs.temp + '/' + config.tempDirs.server + '/';
const appName = config.eb.appName;
const envName = config.eb.staging.envName;
const s3bucket = config.s3.bucketName;

const s3 = new aws.S3();
const eb = new aws.ElasticBeanstalk();

async function deployBackend() {
    try {
        console.log('This script will deploy the latest in the /server directory to the backend application');
        console.log('Please make sure there is no files in the working directory (do a `git stash` if you are unsure)');

        await prettEnterKey();

        console.log();
        console.log('(1/5) getting branch and commit info');
        const gitInfo = await getGitCommit();
        console.log(gitInfo);

        if (gitInfo.branch !== 'staging') {
            // throw new Error('You can only deploy to the staging environment on the staging branch');
        }

        console.log();
        console.log('(2/5) creating distribution package from server/');
        await createTempServerDir();
        const zipFileName = await zipServerDir(gitInfo.commit);

        console.log(zipFileName);
        console.log('(3/5) uploading the environment version (distribution) to S3');
        let distributionS3File = await uploadToS3(zipFileName);
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

async function prettEnterKey() {
    return new Promise((resolve, reject) => {
        console.log();
        console.log('Press enter/return key to continue');
        process.stdin.once('data', function () {
            resolve();
        });
    });
}

async function getGitCommit() {
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
}

async function createTempServerDir() {
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

async function zipServerDir(commit) {
    const directoryToZip = tempDirName + config.tempDirs.server;
    const zipPath = tempDirName;
    const zipName = 'server_' + commit;
    const zipFile = zipPath + '/' + zipName + '.zip';
    // create a file to stream archive data to.
    let output = fs.createWriteStream(zipFile);
    let archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });

    return new Promise((resolve, reject) => {
        // listen for all archive data to be written
        // 'close' event is fired only when a file descriptor is involved
        output.on('close', function() {
            console.log(archive.pointer() + ' total bytes');
            console.log('archiver has been finalized and the output file descriptor has closed.');
            resolve({
                path: zipPath,
                name: zipName,
                file: zipFile
            })
        });

        // This event is fired when the data source is drained no matter what was the data source.
        // It is not part of this library but rather from the NodeJS Stream API.
        // @see: https://nodejs.org/api/stream.html#stream_event_end
        output.on('end', function() {
            console.log('Data has been drained');
        });

        // good practice to catch warnings (ie stat failures and other non-blocking errors)
        archive.on('warning', function(err) {
            if (err.code === 'ENOENT') {
                console.log(err);
            } else {
                reject(err);
            }
        });

        // good practice to catch this error explicitly
        archive.on('error', function(err) {
            reject(err);
        });

        // pipe archive data to the file
        archive.pipe(output);

        // append files from a sub-directory, putting its contents at the root of archive
        archive.directory(directoryToZip, false);

        // finalize the archive (ie we are done appending files but streams have to finish yet)
        // 'close', 'end' or 'finish' may be fired right after calling this method so register to them beforehand
        archive.finalize();
    });
}

async function uploadToS3(zipFileName) {
    const s3Key = envName + '/' + zipFileName.name + '.zip';

    return await s3.upload({
        Bucket: s3bucket,
        Key: s3Key,
        Body: fs.createReadStream(zipFileName.file)
    }).promise();
}