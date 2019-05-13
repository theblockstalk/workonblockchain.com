const auth = require('../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const errors = require('../../services/errors');
const sanitizer = require('../../services/sanitize');
const emailTemplates = require('../../../model/mongoose/email_templates');

module.exports.request = {
    type: 'post',
    path: '/email_templates'
};

const querySchema = new Schema({
    admin: Boolean,
});

const bodySchema = new Schema({
    name:{
        type:String,
        required:true,
    },
    subject:{
        type:String,
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
    const sanitizedBody = sanitizer.sanitizeHtml(req.unsanitizedBody.body);

    const emailTemplateDoc = await emailTemplates.findOne({name: queryBody.name});
    if(emailTemplateDoc) {
       errors.throwError("Template name already exists", 400);
    }
    else {
        let addNewTemplate = {
            name : queryBody.name,
            body: sanitizedBody,
            updated_by: userId,
            updated_date: timestamp
        };
        if(queryBody.subject) addNewTemplate.subject = queryBody.subject;
        await emailTemplates.insert(addNewTemplate);
        res.send(true);
    }
}