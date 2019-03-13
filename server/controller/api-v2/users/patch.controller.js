const auth = require('../../../middleware/auth-v2');
const Schema = require('mongoose').Schema;
const enumerations = require('../../../../model/enumerations');
const regexes = require('../../../../model/regexes');
const multer = require('../../../../controller/middleware/multer');
const objects = require('../../../services/objects');
const Pages = require('../../../../model/pages_content');

const companies = require('../../../../model/mongoose/company');

module.exports.request = {
    type: 'patch',
    path: '/users/:user_id/'
};
const paramSchema = new Schema({
    user_id: String
});

const bodySchema = new Schema({
    marketing_emails: {
        type: Boolean,
    },
    privacy_id: {
        type : String
    },
    terms_id: {
        type : String
    }
});

module.exports.inputValidation = {
    params: paramSchema,
    body: bodySchema
};

module.exports.files = async function(req) {
    await multer.uploadOneFile(req, "company_logo");
}

module.exports.auth = async function (req) {
    await auth.isLoggedIn(req);
}


module.exports.endpoint = async function (req, res) {
    console.log(req.auth.user);
    process.exit();
    let userId;
    userId = req.auth.user._id;
    const employerDoc = await companies.findOne({ _creator: userId });

    if(employerDoc){
        const queryBody = req.body;
        if(queryBody.privacy_id)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.privacy_id}).lean();
            if(pagesDoc) employerUpdate.privacy_id = pagesDoc._id;
            else errors.throwError("Privacy notice document not found", 404);
        }

        if(queryBody.terms_id)
        {
            const pagesDoc =  await Pages.findOne({_id: queryBody.terms_id}).lean();
            if(pagesDoc) employerUpdate.terms_id = pagesDoc._id;
            else errors.throwError("Privacy notice document not found", 404);
        }
        if(queryBody.marketing_emails) employerUpdate.marketing_emails = queryBody.marketing_emails;

        await companies.update({ _id: employerDoc._id },{ $set: employerUpdate});

        const updatedEmployerDoc = await companies.findOneAndPopulate(userId);
        res.send(updatedEmployerDoc);
    }
    else {
        errors.throwError("Company account not found", 404);
    }
}