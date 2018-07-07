var multer = require('multer');
// const fileUpload = require('express-fileupload');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const settings = require('../services/settings');

let uploadPhoto;

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    let s3 = new aws.S3({
        params: {
            Bucket: settings.AWS.S3_BUCKET
        },
        region : settings.AWS.REGION
    });

    uploadPhoto = multer({
        storage: multerS3({
            s3: s3,
            bucket: settings.AWS.S3_BUCKET,
            metadata: function (req, file, cb) {
                cb(null, {fieldName: file.fieldname});
            },
            key: function (req, file, cb) {
                cb(null, Date.now().toString() + file.originalname)
            }
        })
    }).single('photo');
} else {
    uploadPhoto = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'uploads')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now().toString() + file.originalname)
            }
        })
    }).single('photo');
}

module.exports.uploadPhoto = uploadPhoto;
