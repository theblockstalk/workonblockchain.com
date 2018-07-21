const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const settings = require('../settings');

let appMulter;

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    console.log('Configuring multer with S3 bucket');

    aws.config.update({
        secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
        accessKeyId: settings.AWS.ACCESS_KEY,
        region: settings.AWS.REGION
    });

    let s3 = new aws.S3();

    appMulter = multer({
        storage: multerS3({
            s3: s3,
            bucket: settings.AWS.S3_BUCKET,
            key: function (req, file, cb) {
                console.log('file', file);
                cb(null, Date.now().toString() + file.originalname);
            }
        })
    });
} else {
    console.log('Configuring local multer to /uploads folder');

    appMulter = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now().toString() + file.originalname)
            }
        })
    });
}

module.exports = appMulter;
