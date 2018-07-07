var multer = require('multer');
// const fileUpload = require('express-fileupload');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const settings = require('../services/settings');

let uploadMulter;

if (settings.ENVIRONMENT === 'production' || settings.ENVIRONMENT === 'staging') {
    let s3 = new aws.S3({
        params: {
            Bucket: settings.AWS.S3_BUCKET
        },
        region : settings.AWS.REGION
    });

    uploadMulter = multer({
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
})
} else {
    uploadMulter = multer({
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public')
            },
            filename: function (req, file, cb) {
                cb(null, Date.now().toString() + file.originalname)
            }
        })
    })
}

let uploadPhoto = uploadMulter.single('photo');

module.exports.uploadMulter = uploadMulter;
module.exports.uploadPhoto = uploadPhoto;
