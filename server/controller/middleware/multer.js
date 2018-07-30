const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const settings = require('../../settings');
const sanitizer = require('./sanitizer');
const logger = require('../services/logger');

let appMulter;

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    logger.info('Configuring multer with S3 bucket');

    aws.config.update({
        secretAccessKey: settings.AWS.SECRET_ACCESS_KEY,
        accessKeyId: settings.AWS.ACCESS_KEY,
        region: settings.AWS.REGION
    });

    let s3 = new aws.S3();

    appMulter = multer({
        storage: multerS3({
            s3: s3,
            bucket: settings.AWS.BUCKETS.files,
            key: function (req, file, cb) {
                logger.debug('file', file);
                const originalname = sanitizer.recursivelySanitize(file.originalname);
                cb(null, Date.now().toString() + originalname);
            }
        })
    });
} else {
    logger.info('Configuring local multer to /uploads folder');

    appMulter = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                const originalname = sanitizer.recursivelySanitize(file.originalname);
                cb(null, Date.now().toString() + originalname)
            }
        })
    });
}

module.exports = appMulter;
