const gitRev = require('git-rev');
const ncp = require('ncp').ncp;
const fs = require('fs');
const archiver = require('archiver');
const aws = require('aws-sdk');
const s3 = require('s3');
const accessKey = require('./access/accessKey');
const { exec } = require('child_process');
const del = require('del');
const mkdirp = require('mkdirp');

ncp.limit = 16;

aws.config.update({
    secretAccessKey: accessKey.secretAccessKey,
    accessKeyId: accessKey.accessKeyId,
    region: "eu-west-1"
});

const awsS3 = new aws.S3();
const awsEb = new aws.ElasticBeanstalk();

module.exports.pressEnterToContinue = async function pressEnterToContinue(message) {
    if (!message) message = 'Press enter/return key to continue, or Ctr+C to exit.';
    return new Promise((resolve, reject) => {
        console.log();
        console.log(message);
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
    });

    return {
        branch: branch,
        commit: commitHead
    }
};

module.exports.checkGitBranch = function checkGitBranch(branch, deployment) {
    let expectedBranch;
    switch (deployment) {
        case 'staging':
            expectedBranch = 'staging';
            break;
        case 'production':
            expectedBranch = 'staging';
            break;
        default:
            throw new Error("Deployment" + deployment + " is not valid");
    }
    if (branch !== expectedBranch) {
        throw new Error('You can only deploy to the ' + deployment + ' environment on the ' + expectedBranch + ' branch');
    }
};

module.exports.createTempServerDir = async function createTempServerDir(tempServerDirName, environmentName) {
    const options = {
        // Do not copy the node_modules folder
        filter: /^((?!node_modules).)*$/
    };

    await copyDir('./server', tempServerDirName, options);

    if (environmentName === 'production') {
        fs.unlinkSync(tempServerDirName + 'config/staging.json');
    } else {
        fs.unlinkSync(tempServerDirName + 'config/production.json');
    }

};

module.exports.createTempClientDir = async function createTempClientDir(tempClientDirName) {
    await copyDir('./client/dist', tempClientDirName);
};

async function copyDir(from, to, options) {
    await mkdirp(to);

    await del(to + '*');

    return new Promise((resolve, reject) => {
        let cb = function cb(err) {
            if (err) {
                console.log(err);
                reject(err);
            }
            resolve();
        };
        if (options) {
            ncp(from, to, options, cb);
        } else {
            ncp(from, to, cb);
        }
    });
}

module.exports.addServerVersion = async function addServerVersion(tempServerDirName, versonName) {
    const versionObj = {
        version: versonName
    };
    fs.writeFileSync(tempServerDirName + 'config/version.json', JSON.stringify(versionObj));
};

module.exports.zipServerDir = async function zipServerDir(tempDirName, directoryToZip, zipName) {
    const zipPath = tempDirName;
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
};

module.exports.uploadZipfileToS3 = async function uploadToS3(envName, s3bucket, zipFileName) {
    const s3Key = 'versions/' + envName + '/' + zipFileName.name + '.zip';

    return await awsS3.upload({
        Bucket: s3bucket,
        Key: s3Key,
        Body: fs.createReadStream(zipFileName.file)
    }).promise();
};

module.exports.addElasticEnvironmentVersion = async function addElisticEnvironmentVersion(s3bucket, appName, zipFileName, distributionS3File) {
    try {
        const ebVersion = await awsEb.createApplicationVersion({
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
};

module.exports.updateElisticEnvironment = async function updateElisticEnvironment(appName, envName, zipFileName) {
    return awsEb.updateEnvironment({
        ApplicationName: appName,
        EnvironmentName: envName,
        OptionSettings: [{
            Namespace: 'aws:elasticbeanstalk:container:nodejs',
            OptionName: 'NodeCommand',
            Value: 'npm start'
        }],
        VersionLabel: zipFileName.name
    }).promise();
};

module.exports.buildAngularDistribution = async function buildAngularDistribution(buildCommand) {
    return new Promise((resolve, reject) => {
        exec('cd ./client && ' + buildCommand, (err, stdout, stderr) => {
            if (err) {
                reject(err);
            }

            console.log(`stdout: `, stdout);
            console.log(`stderr: `, stderr);
            resolve();
        });
    });
};

module.exports.syncDirwithS3 = async function syncDirwithS3(s3bucket, tempClientDirName) {
    const s3Client = s3.createClient({
        // maxAsyncS3: 20,     // this is the default
        // s3RetryCount: 3,    // this is the default
        // s3RetryDelay: 1000, // this is the default
        // multipartUploadThreshold: 20971520, // this is the default (20 MB)
        // multipartUploadSize: 15728640, // this is the default (15 MB)
        s3Options: {
            secretAccessKey: accessKey.secretAccessKey,
            accessKeyId: accessKey.accessKeyId,
            region: "eu-west-1",
            // endpoint: s3bucket,
            // sslEnabled: true
            // any other options are passed to new AWS.S3()
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Config.html#constructor-property
        },
    });

    const params = {
        localDir: tempClientDirName,
        deleteRemoved: true, // default false, whether to remove s3 objects
                             // that have no corresponding local file.

        s3Params: {
            Bucket: s3bucket,
            // Prefix: "some/remote/dir/",
            // other options supported by putObject, except Body and ContentLength.
            // See: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#putObject-property
        },
    };

    console.log(params)

    await new Promise((resolve, reject) => {
        let uploader = s3Client.uploadDir(params);
        uploader.on('error', function(err) {
            console.error("unable to sync:", err.stack);
            reject(err);
        });

        let counter = 0, counterLimit = 100;
        uploader.on('progress', function() {
            counter++;
            if (counter === counterLimit) {
                console.log(uploader.progressAmount/ 1000000 + ' Mb of ' + uploader.progressTotal / 1000000 + ' Mb completed');
                counter = 0;
            }

        });
        uploader.on('end', function() {
            console.log("done uploading");
            resolve();
        });
    })

};