const gitRev = require('git-rev');
const ncp = require('ncp').ncp;
const fs = require('fs');
const archiver = require('archiver');
const aws = require('aws-sdk');
const s3 = require('s3');
const { exec } = require('child_process');
const del = require('del');
const mkdirp = require('mkdirp');

ncp.limit = 16;

const awsConfig = {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: "eu-west-1"
}

aws.config.update(awsConfig);

const awsS3 = new aws.S3();
const awsEb = new aws.ElasticBeanstalk();
const awsCf = new aws.CloudFront();

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
            expectedBranch = 'master';
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

};

module.exports.createTempClientDir = async function createTempClientDir(tempClientDirName, createSeoFiles) {
    await copyDir('./client/dist', tempClientDirName);

    if (createSeoFiles) {
        await copyFile('./scripts/seo/robots.txt', tempClientDirName + 'robots.txt');
        await copyFile('./scripts/seo/sitemap.xml', tempClientDirName + 'sitemap.xml');
    }
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

const execCommand = async function (command) {
  return new Promise((resolve, reject) => {
      exec(command, (err, stdout, stderr) => {
          if (err) {
              reject(err);
          }
          if (stderr) {
              reject(stderr);
          }

          console.log(stdout);
          // console.error(stderr);
          resolve();
      });
  });
}


const copyFile = function (source, target) {
    let readStream = fs.createReadStream(source);

    return new Promise((resolve, reject) => {
        readStream.on("error", function(err) {
            reject(err);
        });

        let writeStream = fs.createWriteStream(target);
        writeStream.on("error", function(err) {
            reject(err);
        });
        writeStream.on("close", resolve);
        readStream.pipe(writeStream);
    });
}

module.exports.addVersionFile = async function (tempFileName, versonName) {
    const versionObj = {
        version: versonName
    };
    fs.writeFileSync(tempFileName, JSON.stringify(versionObj));
};

module.exports.zipServerDir = async function (tempDirName, directoryToZip, zipName) {
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

module.exports.uploadZipfileToS3 = async function (envName, s3bucket, zipFileName) {
    const s3Key = 'versions/' + envName + '/' + zipFileName.name + '.zip';

    return await awsS3.upload({
        Bucket: s3bucket,
        Key: s3Key,
        Body: fs.createReadStream(zipFileName.file)
    }).promise();
};

module.exports.addElasticEnvironmentVersion = async function (s3bucket, appName, zipFileName, distributionS3File) {
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

module.exports.updateElisticEnvironment = async function (appName, envName, zipFileName) {
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

module.exports.buildAngularAndServer = async function (buildCommand) {
  let command = 'cd ./client && npm install && ' + buildCommand;
  // let command = 'cd ./client && ' + buildCommand;
  console.log('Running command: ' + command);

    await execCommand(command);
};

module.exports.deployLambda = async function (environment) {
    let command = 'sudo npm install -g serverless';
    console.log('Running command: ' + command);
    await execCommand(command);

    command = 'serverless config credentials --provider aws --key ' + awsConfig.accessKeyId + ' --secret ' + awsConfig.secretAccessKey;
    await execCommand(command);

    command = 'serverless deploy --stage ' + environment;
    console.log('Running command: ' + command);
    await execCommand(command);
};

module.exports.invalidateCloudfronntCache = async function (cloudFrontId) {
    const params = {
        DistributionId: cloudFrontId,
        InvalidationBatch: {
            CallerReference: 'Bitbucket deployment pipeline ' + new Date(),
            Paths: {
                Quantity: 1,
                Items: [
                    '/*',
                ]
            }
        }
    };
    let data = await new Promise((res, rej) => {
        awsCf.createInvalidation(params, (err, data) => {
            if (err) {
                console.log(err, err.stack);
                rej(err);
            }
            else res(data);
        })
    })
    console.log(data);
}
