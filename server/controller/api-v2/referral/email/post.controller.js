const Schema = require('mongoose').Schema;
const auth = require('../../../middleware/auth-v2');
const referUserEmail = require('../../../services/email/emails/referUser');
const sanitize = require('../../../services/sanitize');
const regexes = require('../../../../model/regexes');

module.exports.request = {
    type: 'post',
    path: '/referral/email'
};

const bodySchema = new Schema({
    email: {
        type: String,
        validate: regexes.email,
        lowercase: true,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    }
});

module.exports.inputValidation = {
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
};

module.exports.endpoint = async function (req, res) {
    let sanitizedHtmlBody = sanitize.sanitizeHtml(req.unsanitizedBody.body)
    let queryBody = req.body;
    await referUserEmail.sendEmail(queryBody.email, queryBody.subject, sanitizedHtmlBody);
    res.send({
        success : true ,
        msg : 'Email has been sent successfully.'
    });
}