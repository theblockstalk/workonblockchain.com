const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const emailTemplates = require('../../../../model/mongoose/email_templates');
const errors = require('../../../services/errors');

module.exports.request = {
    type: 'get',
    path: '/email_templates'
};

const querySchema = new Schema({
    admin: Boolean
});

module.exports.inputValidation = {
    query: querySchema
}

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
    if(!req.query.admin) throw new Error("User is not an admin");
}

module.exports.endpoint = async function (req, res) {
    const emailTemplateDoc = await emailTemplates.findAll();
    res.send(emailTemplateDoc);
}