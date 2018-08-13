const gitRev = require('git-rev');
const ncp = require('ncp').ncp;
const fs = require('fs');
const aws = require('aws-sdk');
const archiver = require('archiver');
const accessKey = require('./access/accessKey');

ncp.limit = 16;

aws.config.update({
    secretAccessKey: accessKey.secretAccessKey,
    accessKeyId: accessKey.accessKeyId,
    region: "eu-west-1"
});

const s3 = new aws.S3();

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
};

module.exports.zipServerDir = async function zipServerDir(tempDirName, directoryToZip, commit) {
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
};

module.exports.uploadToS3 = async function uploadToS3(envName, s3bucket, zipFileName) {
    const s3Key = envName + '/' + zipFileName.name + '.zip';

    return await s3.upload({
        Bucket: s3bucket,
        Key: s3Key,
        Body: fs.createReadStream(zipFileName.file)
    }).promise();
}