var Q = require('q');
const referUserEmail = require('../../../services/email/emails/referUser');
const logger = require('../../../services/logger');
const sanitize = require('../../../services/sanitize');

module.exports = async function (req, res) {

    let sanitizedHtmlBody = sanitize.sanitizeHtml(req.unsanitizedBody.body)
    let queryBody = req.body;
    await referUserEmail.sendEmail(queryBody.email, queryBody.subject, sanitizedHtmlBody);
    res.send({
        success : true ,
        msg : 'Email has been sent successfully.'
    });

}
