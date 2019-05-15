const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const errors = require('../../services/errors');
const sanitizer = require('../../services/sanitize');
const emailTemplates = require('../../../model/mongoose/email_templates');
const objects = require('../../services/objects');

module.exports.request = {
    type: 'patch',
    path: '/email_templates/search'
};

const querySchema = new Schema({
    admin: Boolean,
    template_id: String
});

const bodySchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
        required:true,
    },
    body: {
        type:String,
        required:true,
    }
});

module.exports.inputValidation = {
    query: querySchema,
    body: bodySchema
};

module.exports.auth = async function (req) {
    await auth.isAdmin(req);
    if(!req.query.admin) throw new Error("User is not an admin");
}


module.exports.endpoint = async function (req, res) {
    let queryBody = req.body;
    let userId = req.auth.user._id;
    let timestamp = new Date();
    const sanitizedBody = sanitizer.sanitizeHtml(req.unsanitizedBody.body, true);
    let emailTemplateDoc = await emailTemplates.findOneById(req.query.template_id);
    if(emailTemplateDoc) {
        if(emailTemplateDoc.name !== queryBody.name) {
            const emailTemplateDocByName = await emailTemplates.findOne({name: queryBody.name});
            if(emailTemplateDocByName) {
                errors.throwError("Template name already exists", 400);
            }
        }
        let updateTemplate = {
            name: queryBody.name,
            subject: queryBody.subject,
            body: sanitizedBody,
            updated_by: userId,
            updated_date: timestamp
        };
        await emailTemplates.update({_id: emailTemplateDoc._id}, {$set: updateTemplate});
        res.send(true);
    }
    else {
        errors.throwError("Template doc not found", 404);
    }
}